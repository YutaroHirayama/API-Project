const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const user = require('../../db/models/user');

const reviewsRouter = express.Router();

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];


/* GET ALL REVIEWS OF THE CURRENT USER */
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
          },
          required: false
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
    if(review.Spot.SpotImages.length)
    review.Spot.previewImage = review.Spot.SpotImages[0].url
    delete review.Spot.SpotImages;
  })

  res.json({Reviews: reviewsList})
});


/* EDIT A REVIEW */

reviewsRouter.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { review, stars } = req.body;
  const userId = req.user.id;
  const reviewId = parseInt(req.params.reviewId);

  const editReview = await Review.findByPk(reviewId);

  if(!editReview) {
    const err = new Error("Review couldn't be found")
    err.status = 404;
    return next(err);
  };

  if(editReview.userId !== userId) {
    const err = new Error("Forbidden")
    err.status = 403;
    return next(err);
  };

  if(review) editReview.review = review;
  if(stars) editReview.stars = stars;

  await editReview.save();

  return res.json(editReview);
})

/* ADD AN IMAGE TO A REVIEW BASED ON THE REVIEW'S ID */

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
});



/* DELETE AN EXISTING REVIEW */

reviewsRouter.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);
  const userId = req.user.id;

  const review = await Review.findByPk(reviewId);

  if(!review) {
    const err = new Error("Review couldn't be found")
    err.status = 404;
    return next(err);
  };

  if(review.userId !== userId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  };

  await review.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200
  });
});


/* SPOTS ERROR HANDLER */
reviewsRouter.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    statusCode: err.status,
    errors: err.errors
  });
});

module.exports = { reviewsRouter, validateReview };
