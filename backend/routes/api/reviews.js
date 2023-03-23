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

  reviewsRes.previewImage = reviews.SpotImages.url
  delete reviewsRes.SpotImages;

  res.json(reviewsRes)
})

module.exports = reviewsRouter;
