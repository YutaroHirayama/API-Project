const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const user = require('../../db/models/user');
const { Op } = require('sequelize');

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


/* EDIT A BOOKING */

bookingsRouter.put('/:bookingId', requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const userId = req.user.id;
  const bookingId = parseInt(req.params.bookingId);

  const booking = await Booking.findByPk(bookingId);

  if(!booking) {
    const err = new Error("Booking couldn't be found")
    err.status = 404;
    return next(err);
  }

  if(booking.userId !== userId) {
    const err = new Error("Forbidden")
    err.status = 403;
    return next(err);
  }
  const bookingEndDate = new Date(booking.endDate).toUTCString();
  const reqStartDate = new Date(startDate).toUTCString();
  const reqEndDate = new Date(endDate).toUTCString();
  const currentDate = new Date().toUTCString();

  const bookingEndTime = new Date(bookingEndDate).getTime();
  const startTime = new Date(reqStartDate).getTime();
  const endTime = new Date(reqEndDate).getTime();
  const current = new Date(currentDate).getTime();

  const bookings = await Booking.findAll({
    where: {
      spotId: booking.spotId,
      id: {
        [Op.not]: booking.id
      }
    }
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

  if(bookingEndTime < current) {
    const err = new Error("Past bookings can't be modified");
    err.status = 403;
    return next(err);
  }

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
  };

  if(startDate) booking.startDate = new Date(startDate);
  if(endDate) booking.endDate = new Date(endDate);

  await booking.save();
  return res.json(booking);
})

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
