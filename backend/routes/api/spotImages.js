const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const user = require('../../db/models/user');
const review = require('../../db/models/review');

const spotImagesRouter = express.Router();

spotImagesRouter.delete('/:imageId', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const imageId = parseInt(req.params.imageId);

  const image = await SpotImage.findOne({
    where: {id: imageId},
    include: {
      model: Spot
    }
  });

  if(!image) {
    const err = new Error("Spot Image couldn't be found")
    err.status = 404;
    return next(err);
  };

  if(image.Spot.ownerId !== userId) {
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
spotImagesRouter.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    statusCode: err.status,
    errors: err.errors
  });
});


module.exports = spotImagesRouter;
