'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: new Date('2023-06-10'),
        endDate: new Date('2023-06-16')
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date('2023-07-10'),
        endDate: new Date('2023-07-14')
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-05-04')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', null, {})
  }
};
