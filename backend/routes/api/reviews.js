const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const user = require('../../db/models/user');

const reviewsRouter = express.Router();

// Get all Reviews of the current user
reviewsRouter.get('/current', requireAuth, async (req, res, next) => {

  const reviews = await Review.findAll({
    where: {
      userId: req.user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: {
          exclude: ['description','createdAt','updatedAt']
        },
        include: {
          model: SpotImage,
          attributes: ['url'],
          where: {
            preview: true
          }
        }
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      },
    ]
  });

  let reviewsList = [];
  reviews.forEach(review => reviewsList.push(review.toJSON()));

  reviewsList.forEach(review => {
    review.Spot.previewImage = review.Spot.SpotImages[0].url
    delete review.Spot.SpotImages;
  })

  res.json({Reviews: reviewsList})
});

/* Add an Image to a Review based on the Review's id */

reviewsRouter.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);
  const userId = req.user.id;
  const url = req.body.url;

  const review = await Review.findOne({
    where: {id: reviewId},
    include: {
      model: ReviewImage
    }
  });

  if(!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
      statusCode: 404
    });
  };

  if(review.userId !== userId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  };

  if(review.ReviewImages.length >= 10) {
    const err = new Error('Maximum number of images for this resource was reached.');
    err.status = 403;
    return next(err);
  }

  const image = await review.createReviewImage({url});

  const resImage = image.toJSON();
  delete resImage.reviewId;
  delete resImage.updatedAt;
  delete resImage.createdAt;

  res.json(resImage);
})



/* SPOTS ERROR HANDLER */
reviewsRouter.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    statusCode: err.status,
    errors: err.errors
  });
});

module.exports = reviewsRouter;
