const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const user = require('../../db/models/user');


const bookingsRouter = express.Router();

/* GET ALL OF THE CURRENT USER'S BOOKINGS */

bookingsRouter.get('/current', requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  const bookings = await Booking.findAll({
    where: {userId},
    include: {
      model: Spot,
      attributes: {
        exclude: ['description', 'createdAt', 'updatedAt']
      },
      include: {
        model: SpotImage,
        attributes: ['url'],
        where: {preview: true},
        required: false
      }
    }
  });

  let bookingsList = [];
  bookings.forEach(booking => bookingsList.push(booking.toJSON()));

  bookingsList.forEach(booking => {

    if(booking.Spot.SpotImages.length) {
      booking.Spot.previewImage = booking.Spot.SpotImages[0].url;
    } else {
      booking.Spot.previewImage = 'This spot does not have Images (yet).'
    }

    delete booking.Spot.SpotImages;
  });

  res.json({Bookings:bookingsList});
})

/* DELETE A BOOKING */

bookingsRouter.delete('/:bookingId', requireAuth, async (req, res, next) => {
  const bookingId = parseInt(req.params.bookingId);
  const userId = req.user.id;

  const booking = await Booking.findOne({
    where: {id: bookingId},
    include: {model: Spot}
  });

  if(!booking) {
    const err = new Error("Booking couldn't be found")
    err.status = 404;
    return next(err);
  };

  if((booking.userId !== userId) && (booking.Spot.ownerId !== userId)) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  };


  const currentDate = new Date().toUTCString();
  const current = new Date(currentDate).getTime();
  const bookingTime = booking.startDate.getTime();

  if(current > bookingTime) {
    const err = new Error("Bookings that have been started can't be deleted")
    err.status = 403;
    return next(err);
  }

  await booking.destroy();
  res.json({
    message: "Successfully deleted",
    statusCode: 200
  });
});

/* BOOKING ERROR HANDLER */
bookingsRouter.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    statusCode: err.status,
    errors: err.errors
  });
});

module.exports = bookingsRouter;
