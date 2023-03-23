'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: '185 Stinar Rd',
      city: 'Waterville',
      state: 'Washington',
      country: 'United States',
      lat: 47.65795,
      lng: -120.17994,
      name: 'Earthlight',
      description: 'The villa on top of the world! Earthlight™ is built high atop Pioneer Ridge near Orondo, Washington. With sweeping views of the Columbia River, our unique homes are specifically designed to experience the combination of luxury living and the beauty of nature. Relax in our hot tub while watching the sun descend behind the snowy mountains. Explore our wild trekking paths in spring and summer, and snowshoe through the hills in winter. Watch the deer wander by. Earthlight™ has it all, and then some.',
      price: 521.00
    },
    {
      ownerId: 2,
      address: '809 N Kilkea Dr',
      city: 'West Hollywood',
      state: 'California',
      country: 'United States',
      lat: 34.08576,
      lng: -118.36725,
      name: 'Beverly Crescent',
      description: 'A glass wall slides away to open the living room to a backyard designed for entertaining at this architect-crafted L.A. home. Its light-saturated living areas—indoors and out—are the work of Eran Gispan of NE Designs, and the attention to detail is evident in elements from a hidden balcony to built-in cupboards. It’s 1.6 miles to shopping and movies at The Grove, and 11.5 miles to the beach. A walled- and hedged-in courtyard surrounds the villa’s private pool and hot tub, and a row of loungers waits on the sunny patio. Pull the outdoor chairs around the firepit and alfresco TV, or gather for the evening in the home theater.',
      price: 2350.00
    },{
      ownerId: 3,
      address: '442 N Halsted St',
      city: 'Chicago',
      state: 'Illinois',
      country: 'United States',
      lat: 41.89031,
      lng: -87.64774,
      name: 'Cloud9',
      description: 'Breathtaking skyline views, upscale kitchen finishes, and designer touches , just a mile away from the lively West Loop neighborhood. Explore the gourmet-style dining, bars, and cafes, or visit Randolph Street Market to get some vintage artwork.',
      price: 655.00
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Earthlight', 'Beverly Crescent', 'Cloud9'] }
    }, {});
  }
};
