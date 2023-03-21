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
        review: 'Absolutely breathtaking views, relaxing and overall a fantastic experience. The amenities are perfect for two and the villa is stunning. ',
        stars: 5,
      },
      {
        spotId: 2,
        userId: 1,
        review: 'I love this home !!!',
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Beautiful apartment with great view! I would stay here again when visiting Chicago.',
        stars: 5
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
