const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const user = require('../../db/models/user');
const reviewimage = require('../../db/models/reviewimage');
const { handle } = require('express/lib/router');
const { validateReview } = require('./reviews.js');
const { query } = require('express-validator/check');
const spotsRouter = express.Router();
const { Op } = require('sequelize');

// validate spot
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({min: -90, max: 90})
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({min: -180, max: 180})
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({min: 1, max: 50})
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({min: 0})
    .withMessage('Price per day is required'),
  handleValidationErrors
];

const validateQuery = [
  query('page')
    .isInt({ min: 0})
    .optional()
    .withMessage('Page must be greater than or equal to 0'),
  query('size')
    .isInt({ min: 0})
    .optional()
    .withMessage('Size must be greater than or equal to 0'),
  query('minLat')
    .isFloat({min: -90, max: 90})
    .optional()
    .withMessage('Latitude is not valid'),
  query('maxLat')
    .isFloat({min: -90, max: 90})
    .optional()
    .withMessage('Latitude is not valid'),
  query('minLng')
    .isFloat({min: -180, max: 180})
    .optional()
    .withMessage('Minimum latitude is invalid'),
  query('maxLng')
    .isFloat({min: -180, max: 180})
    .optional()
    .withMessage('Maximum latitude is invalid'),
  query('minPrice')
    .isFloat({min: 0})
    .optional()
    .withMessage('Minimum price must be greater than or equal to 0'),
  query('maxPrice')
    .isFloat({min: 0})
    .optional()
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];

/* GET ALL SPOTS */
spotsRouter.get('/', validateQuery, async (req, res, next) => {
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;


  page = parseInt(page);
  size = parseInt(size);
  if(Number.isNaN(page)) page = 0;
  if(Number.isNaN(size)) size = 20;
  if(page > 10) page = 10;
  if(size > 20) size = 20;

  const offset = size * (page - 1)

  let pagination = {};
  if( page >= 1 && size >= 1) {
    pagination.limit = size;
    pagination.offset = offset;
}

  const whereClause = {};
  if(minLat) whereClause.lat = {[Op.gte]: parseFloat(minLat)};
  if(maxLat) whereClause.lat = {[Op.lte]: parseFloat(maxLat)};
  if(minLng) whereClause.lng = {[Op.gte]: parseFloat(minLng)};
  if(maxLng) whereClause.lng = {[Op.lte]: parseFloat(maxLng)};
  if(minPrice) whereClause.price = {[Op.gte]: parseFloat(minPrice)};
  if(maxPrice) whereClause.price = {[Op.lte]: parseFloat(maxPrice)};

  const allSpots = await Spot.findAll({
    include: [
      {model: Review},
      {model: SpotImage}
    ],
    where: whereClause,
    ...pagination
  }); // Returns array of all spots

  let spotsList = [];
  allSpots.forEach(spot => spotsList.push(spot.toJSON())); // converting Objects to JSON Object

  // Manipulating spots objects in allSpots array
  spotsList.forEach(spot => {

    // adding avgRating to each spot Object
    const reviewCount = spot.Reviews.length; // Total number of reviews per spot
    let totalStars = 0;
    spot.Reviews.forEach(review => totalStars += review.stars); // Sums all stars per spot
    spot.avgRating = totalStars / reviewCount; // sets avgRating key in spot object equal to average star rating

    // if(!spot.avgRating) spot.avgRating = 'No reviews (yet)'; // if no reviews

    // adding previewImage url
    spot.SpotImages.forEach(image => {
      if(image.preview) spot.previewImage = image.url; // sets previewImage to url of SpotImage
    })

    // if(!spot.previewImage) spot.previewImage = 'No preview available.'; //if no preview SpotImages available

    // Remove Review and SpotImages attributes on response
    delete spot.Reviews;
    delete spot.SpotImages;
  })

  res.json({Spots:spotsList, page, size});
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

  // if(!spots.length) {
  //   return res.send('You do not own any spots (yet).')
  // }
  let spotsList = [];
  spots.forEach(spot => spotsList.push(spot.toJSON()));

  spotsList.forEach(spot => {

    const reviewCount = spot.Reviews.length;
    let totalStars = 0;
    spot.Reviews.forEach(review => totalStars += review.stars);
    spot.avgRating = totalStars / reviewCount;

    // if(!spot.avgRating) spot.avgRating = 'No reviews (yet)';

    spot.SpotImages.forEach(image => {
      if(image.preview) spot.previewImage = image.url;
    })

    // if(!spot.previewImage) spot.previewImage = 'No preview available.';

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
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    return next(err);
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

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    return next(err);
  }

  const reviews = await spot.getReviews({
    include: [
      {model: User, attributes: ['id', 'firstName', 'lastName']},
      {model: ReviewImage, attributes: ['id','url']}
    ],
  });

  if(!reviews.length) {
    return res.send('This spot does not have any reviews (yet).')
  }

  res.json({Reviews: reviews})
})

/* GET ALL BOOKINGS FOR A SPOT BASED ON THE SPOT's ID */

spotsRouter.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    return next(err);
  }

  const bookings = await spot.getBookings({
    include: {
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    }
  });

  const bookingsList = [];
  bookings.forEach(booking => bookingsList.push(booking.toJSON()));

  if(spot.ownerId !== userId) {
    bookingsList.forEach(booking => {
      delete booking.User;
      delete booking.id;
      delete booking.userId;
      delete booking.createdAt;
      delete booking.updatedAt;
    })
  }
  res.json({Bookings:bookingsList});
})

/* CREATE A REVIEW FOR A SPOT BASED ON THE SPOT'S ID*/

spotsRouter.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const { review, stars } = req.body;
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    return next(err);
  }

  const reviews = await spot.getReviews();
  reviews.forEach(review => {
    if(review.userId === userId) {
      const err = new Error("User already has a review for this spot.")
      err.status = 403;
      throw err;
    }
  })

  const newReview = await spot.createReview({
    userId,
    spotId: spot.id,
    review,
    stars
  });

  res.status(201);
  return res.json(newReview);
})

/* CREATE A BOOKING FROM A SPOT BASED ON THE SPOT'S ID */

spotsRouter.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    return next(err);
  }

  if(spot.ownerId === userId) {
    const err = new Error("Forbidden")
    err.status = 403;
    return next(err);
  }

  const reqStartDate = new Date(startDate).toUTCString();
  const reqEndDate = new Date(endDate).toUTCString();
  const currentDate = new Date().toUTCString();

  const startTime = new Date(reqStartDate).getTime();
  const endTime = new Date(reqEndDate).getTime();
  const current = new Date(currentDate).getTime();

  const bookings = await Booking.findAll({
    where: {spotId}
  });

  if(startTime >= endTime) {
    const err = new Error("Validation error");
    err.status = 400;
    err.errors = ["endDate cannot be on or before startDate"];
    return next(err);
  };

  if(startTime < current) {
    const err = new Error("Validation error");
    err.status = 400;
    err.errors = ["Start date can not be a past date"];
    return next(err);
  };

  if(bookings.length) {
    bookings.forEach(booking => {
      const bookingStart = booking.startDate.toUTCString();
      const bookingEnd = booking.endDate.toUTCString();

      const bookingStartTime = new Date(bookingStart).getTime()
      const bookingEndTime = new Date(bookingEnd).getTime();

      if((startTime >= bookingStartTime && startTime < bookingEndTime) || (endTime > bookingStartTime && endTime <= bookingEndTime) || (startTime <= bookingStartTime && endTime >= bookingEndTime)) {
        const err = new Error("Sorry, this spot is already booked for the specified dates");
        err.status = 403;
        err.errors = [
          "Start date conflicts with an existing booking",
          "End date conflicts with an existing booking"
        ]
        throw err;
      }
    })
  }

  const booking = await spot.createBooking({
    userId,
    startDate: new Date(startDate),
    endDate: new Date(endDate)
  });

  return res.json(booking);

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
    return next(err);
  }

  const spotRes = spot.toJSON();

  spotRes.numReviews = spotRes.Reviews.length; // Total number of reviews per spot
  let totalStars = 0;
  spotRes.Reviews.forEach(review => totalStars += review.stars); // Sums all stars per spot
  spotRes.avgStarRating = totalStars / spotRes.Reviews.length; // sets avgRating key in spot object equal to average star rating
  // if(!spotRes.avgStarRating) spotRes.avgStarRating = 'No reviews (yet)'; // if no reviews

  // if(!spotRes.SpotImages.length) spotRes.SpotImages = 'No images available (yet).'; //if no preview SpotImages available

  delete spotRes.Reviews;

  res.json(spotRes);
});


/* CREATE A SPOT */
spotsRouter.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

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
});

/* EDIT A SPOT */
spotsRouter.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    return next(err);
  }
  if(spot.ownerId !== userId) {
    const err = new Error("Forbidden")
    err.status = 403;
    return next(err);
  }

  if(address) spot.address = address;
  if(city) spot.city = city;
  if(state) spot.state = state;
  if(country) spot.country = country;
  if(lat) spot.lat = lat;
  if(lng) spot.lng = lng;
  if(name) spot.name = name;
  if(description) spot.description = description;
  if(price) spot.price = price;

  await spot.save();

  return res.json(spot);

})

/* DELETE A SPOT */
spotsRouter.delete('/:spotId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    return next(err);
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
