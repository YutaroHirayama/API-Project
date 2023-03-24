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
        where: {preview: true}
      }
    }
  });

  res.json({Bookings:bookings});
})



module.exports = bookingsRouter;
