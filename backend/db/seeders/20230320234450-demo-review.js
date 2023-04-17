'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        review: 'I love this home !!!',
        stars: 4
      },
      {
        spotId: 1,
        userId: 4,
        review: 'Beautiful home with great view! Great stay!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Awesome Place!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: 'I love this home !!!',
        stars: 4
      },
      {
        spotId: 2,
        userId: 4,
        review: 'Beautiful home with great view!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 3,
        review: 'I love this home !!!',
        stars: 3
      },
      {
        spotId: 3,
        userId: 4,
        review: 'Beautiful home with great view!',
        stars: 5
      },
      {
        spotId: 4,
        userId: 4,
        review: 'I love this home !!!',
        stars: 3
      },
      {
        spotId: 4,
        userId: 3,
        review: 'Beautiful home!',
        stars: 5
      },
      {
        spotId: 5,
        userId: 1,
        review: 'I love this home !!!',
        stars: 4
      },
      {
        spotId: 5,
        userId: 4,
        review: 'Beautiful home!',
        stars: 5
      },
      {
        spotId: 6,
        userId: 1,
        review: 'I love this home !!! Perfect place!',
        stars: 5
      },
      {
        spotId: 6,
        userId: 4,
        review: 'Beautiful home!',
        stars: 5
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
<<<<<<< HEAD
    await queryInterface.dropTable('Reviews');
=======
    await queryInterface.bulkDelete('Reviews', null, {})
>>>>>>> dev
  }
};
