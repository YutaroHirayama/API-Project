'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: '06/10/23',
        endDate: '06/16/23'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '07/10/23',
        endDate: '07/14/23'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '05/01/23',
        endDate: '05/04/23'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
