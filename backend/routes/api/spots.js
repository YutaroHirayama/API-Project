const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const user = require('../../db/models/user');
const reviewimage = require('../../db/models/reviewimage');


const spotsRouter = express.Router();


/* GET ALL SPOTS */
spotsRouter.get('/', async (req, res, next) => {

  const allSpots = await Spot.findAll({include: [{model: Review}, {model: SpotImage}]}); // Returns array of all spots

  let spotsList = [];
  allSpots.forEach(spot => spotsList.push(spot.toJSON())); // converting Objects to JSON Object

  // Manipulating spots objects in allSpots array
  spotsList.forEach(spot => {

    // adding avgRating to each spot Object
    const reviewCount = spot.Reviews.length; // Total number of reviews per spot
    let totalStars = 0;
    spot.Reviews.forEach(review => totalStars += review.stars); // Sums all stars per spot
    spot.avgRating = totalStars / reviewCount; // sets avgRating key in spot object equal to average star rating

    if(!spot.avgRating) spot.avgRating = 'No reviews (yet)'; // if no reviews

    // adding previewImage url
    spot.SpotImages.forEach(image => {
      if(image.preview) spot.previewImage = image.url; // sets previewImage to url of SpotImage
    })

    if(!spot.previewImage) spot.previewImage = 'No preview available.'; //if no preview SpotImages available

    // Remove Review and SpotImages attributes on response
    delete spot.Reviews;
    delete spot.SpotImages;
  })

  res.json({Spots:spotsList});
});


/*GET ALL SPOTS OWNED BY CURRENT USER */
spotsRouter.get('/current', requireAuth, async (req, res, next) => {

  const spots = await Spot.findAll({
    where: {ownerId: req.user.id},
    include: [
      {model: Review},
      {model: SpotImage}
    ]
  });

  if(!spots.length) {
    return res.send('You do not own any spots (yet).')
  }
  let spotsList = [];
  spots.forEach(spot => spotsList.push(spot.toJSON()));

  spotsList.forEach(spot => {

    const reviewCount = spot.Reviews.length;
    let totalStars = 0;
    spot.Reviews.forEach(review => totalStars += review.stars);
    spot.avgRating = totalStars / reviewCount;

    if(!spot.avgRating) spot.avgRating = 'No reviews (yet)';

    spot.SpotImages.forEach(image => {
      if(image.preview) spot.previewImage = image.url;
    })

    if(!spot.previewImage) spot.previewImage = 'No preview available.';

    delete spot.Reviews;
    delete spot.SpotImages;
  })

  res.json({Spots:spotsList});
});

/* ADD AN IMAGE TO A SPOT BASED ON THE SPOT'S ID*/
spotsRouter.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }

  if(spot.ownerId !== userId) {
    const err = new Error("Forbidden")
    err.status = 403;
    return next(err);
  }

  const spotImage = await SpotImage.create({
    spotId,
    url,
    preview
  });

  const newImage = spotImage.toJSON();
  delete newImage.spotId;
  delete newImage.updatedAt;
  delete newImage.createdAt;

  res.json(newImage);
})

/* GET ALL REVIEWS BY A SPOT'S ID*/

spotsRouter.get('/:spotId/reviews', async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);

  const reviews = await Review.findAll({
    where: {spotId},
    include: [
      {model: User, attributes: ['id', 'firstName', 'lastName']},
      {model: ReviewImage, attributes: ['id','url']}
    ],
  });

  if(!reviews.length) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }

  res.json({Reviews: reviews})
})

/* CREATE A REVIEW FOR A SPOT BASED ON THE SPOT'S ID*/

spotsRouter.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
  const { review, stars } = req.body;
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }

  const reviews = await spot.getReviews();
  reviews.forEach(review => {
    if(review.userId === userId) {
      const err = new Error("User already has a review for this spot.")
      err.status = 403;
      return next(err);
    }
  })

  try {
    const newReview = await spot.createReview({
      userId,
      spotId: spot.id,
      review,
      stars
    });

    res.status(201);
    return res.json(newReview);

  } catch(err) {
    err.status = 400;
    err.message = 'Validation Error';
    err.errors = [
      "Review text is required",
      "Stars must be an integer from 1 to 5",
    ]
    return next(err);
  };
})

/* GET DETAILS OF A SPOT FROM AN ID */
spotsRouter.get('/:spotId', async (req, res, next) => {
  const spotId = parseInt(req.params.spotId)

  const spot = await Spot.findOne({
    where: {id: spotId},
    include: [
      {model: Review},
      {model: SpotImage, attributes: ['id', 'url', 'preview']},
      {model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName']}]
  });

  if(!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    err.statusCode = '404'
    res.json(err);
  }

  const spotRes = spot.toJSON();

  spotRes.numReviews = spotRes.Reviews.length; // Total number of reviews per spot
  let totalStars = 0;
  spotRes.Reviews.forEach(review => totalStars += review.stars); // Sums all stars per spot
  spotRes.avgStarRating = totalStars / spotRes.Reviews.length; // sets avgRating key in spot object equal to average star rating
  if(!spotRes.avgStarRating) spotRes.avgStarRating = 'No reviews (yet)'; // if no reviews

  if(!spotRes.SpotImages.length) spotRes.SpotImages = 'No images available (yet).'; //if no preview SpotImages available

  delete spotRes.Reviews;

  res.json(spotRes);
});


/* CREATE A SPOT */
spotsRouter.post('/', requireAuth, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  try {
      const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      });
    res.status(201);
    return res.json(newSpot);

  } catch (err) {
    err.status = 400;
    err.message = 'Validation Error'
    err.errors = [
      "Street address is required",
      "City is required",
      "State is required",
      "Country is required",
      "Latitude is not valid",
      "Longitude is not valid",
      "Name must be less than 50 characters",
      "Description is required",
      "Price per day is required"
    ];
    return next(err);
  };
});

/* EDIT A SPOT */
spotsRouter.put('/:spotId', requireAuth, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  if(spot.ownerId !== userId) {
    const err = new Error("Forbidden")
    err.status = 403;
    return next(err);
  }

  // try {
  //   handleValidationErrors(req);

  // } catch (err) {
  //   err.status = 400;
  //   err.message = 'Validation Error'
  //   err.errors = [
  //     "Street address is required",
  //     "City is required",
  //     "State is required",
  //     "Country is required",
  //     "Latitude is not valid",
  //     "Longitude is not valid",
  //     "Name must be less than 50 characters",
  //     "Description is required",
  //     "Price per day is required"
  //   ];
  //   return next(err);
  // };

  if(address) spot.address = address;
  if(city) spot.city = city;
  if(state) spot.state = state;
  if(country) spot.country = country;
  if(lat) spot.lat = lat;
  if(lng) spot.lng = lng;
  if(name) spot.name = name;
  if(description) spot.description = description;
  if(price) spot.price = price;
  // spot.updatedAt = ;

  return res.json(spot);

})

/* DELETE A SPOT */
spotsRouter.delete('/:spotId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    });
  }
  if(spot.ownerId !== userId) {
    const err = new Error("Forbidden")
    err.status = 403;
    return next(err);
  }

  await spot.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200
  });
})

/* SPOTS ERROR HANDLER */
spotsRouter.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    statusCode: err.status,
    errors: err.errors
  });
});
module.exports = spotsRouter;
