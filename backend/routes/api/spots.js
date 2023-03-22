const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');


const spotsRouter = express.Router();


// Get all spots
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


// Get all spots owned by Current User
spotsRouter.get('/current', requireAuth, async (req, res, next) => {

  const spots = await Spot.findAll({
    where: {ownerId: req.user.id},
    include: [
      {model: Review},
      {model: SpotImage}
    ]
  }); // Returns array of all spots

  let spotsList = [];
  spots.forEach(spot => spotsList.push(spot.toJSON())); // converting Objects to JSON Object

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

    // Get details of a Spot from an id
    spotsRouter.get('/:spotId', async (req, res, next) => {
      console.log(req.params)
      const spot = await Spot.findOne({
        where: {id: req.params.spotId},
        include: [
          {model: Review},
          {model: SpotImage, attributes: ['id', 'url', 'preview']},
          {model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName']}]
      });

      if(!spot) {
        const err = new Error(`Couldn't find a Spot with the specified id.`)
        err.status = 404;
        err.statusCode = '404'
        return next(err);
      }

      spotRes = spot.toJSON();

      spotRes.numReviews = spotRes.Reviews.length; // Total number of reviews per spot
      let totalStars = 0;
      spotRes.Reviews.forEach(review => totalStars += review.stars); // Sums all stars per spot
      spotRes.avgStarRating = totalStars / spotRes.Reviews.length; // sets avgRating key in spot object equal to average star rating

      spotRes.SpotImages = spot.SpotImages;

      delete spotRes.Reviews;

      res.json(spotRes);
    });

    // Create a Spot
    spotsRouter.post('/', requireAuth, async (req, res, next) => {
      const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body;

      const newSpot = await Spot.create({
        ownerId,
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

  res.json(newSpot);
})


//spots error handler

spotsRouter.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.log(err);
  res.json({
    message: err.message,
    statusCode: err.status,
    errors: err.errors
  });
});
module.exports = spotsRouter;
