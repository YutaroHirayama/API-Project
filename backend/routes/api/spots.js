const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');


const router = express.Router();


// Get all spots
router.get('/', async (req, res, next) => {

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

// // validate signup
// const validateSignup = [
//   check('email')
//     .exists({ checkFalsy: true })
//     .isEmail()
//     .withMessage('Please provide a valid email.'),
//   check('username')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage('Please provide a username with at least 4 characters.'),
//   check('username')
//     .not()
//     .isEmail()
//     .withMessage('Username cannot be an email.'),
//   check('password')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 6 })
//     .withMessage('Password must be 6 characters or more.'),
//   handleValidationErrors
// ];


// Sign up
// router.post(
//   '',
//   validateSignup,
//   async (req, res) => {
//     const { firstName, lastName, email, password, username} = req.body;
//     const hashedPassword = bcrypt.hashSync(password);
//     const user = await User.create({ firstName, lastName, email, username, hashedPassword });

//     const safeUser = {
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       username: user.username,
//     };

//     await setTokenCookie(res, safeUser);

//     return res.json({
//       user: safeUser
//     });
//   }
// );




module.exports = router;
