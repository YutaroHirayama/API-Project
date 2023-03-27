const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const user = require('../../db/models/user');
const review = require('../../db/models/review');

const reviewImagesRouter = express.Router();

/* DELETE A REVIEW IMAGE */

reviewImagesRouter.delete('/:imageId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const imageId = parseInt(req.params.imageId);

  const image = await ReviewImage.findOne({
    where: {id: imageId},
    include: {
      model: Review
    }
  });

  if(!image) {
    const err = new Error("Review Image couldn't be found")
    err.status = 404;
    return next(err);
  };

  if(image.Review.userId !== userId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  };

  await image.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200
  });

});

/* ERROR HANDLER */
reviewImagesRouter.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    statusCode: err.status,
    errors: err.errors
  });
});

module.exports = reviewImagesRouter;
