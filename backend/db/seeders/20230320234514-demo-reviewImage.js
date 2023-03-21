'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-53503031/original/5872d373-ec00-4952-9db3-4fe3b22a3e1c.jpeg?im_w=720'
      },
      {
        reviewId: 2,
        url: 'https://a0.muscache.com/im/pictures/e5120315-85e9-4997-83e4-1f286e956dd3.jpg?im_w=1200'
      },
      {
        reviewId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-759519262986933792/original/3569f536-f89d-44de-97f3-72c3d81019ea.jpeg?im_w=720'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
