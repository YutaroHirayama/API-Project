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
      ownerId: 1,
      address: '1 Palm Springs Dr',
      city: 'Palm Springs',
      state: 'California',
      country: 'United States',
      lat: 33.81326,
      lng: -116.50009,
      name: 'The Butterfly House',
      description: 'Salt water POOL & JACUZZI. Huge FIRE PIT with custom seating. ALKALINE drinking water & SOFT water for bathing. Separate CABANA with bed, AC & full bath. Artfully designed landscaping in front & back with GRILL and BOCCE COURT. BRAND NEW BATHROOMS & APPLIANCES',
      price: 952.75
    },
    {
      ownerId: 1,
      address: '2 Palm Springs Dr',
      city: 'Palm Springs',
      state: 'California',
      country: 'United States',
      lat: 33.81326,
      lng: -116.50009,
      name: 'PS PLAYGROUND',
      description: 'Treat yourself and escape to this Private Paradise in true Palm Springs Style.  Located on a gated ½ acre, and walled-off with Ficus trees for complete privacy, this estate is designed for romance, beauty & fun.  Float in the Saltwater Pool & Spa, relax on the Tanning Shelf, or gaze at the unobstructed San Jacinto Mtn.',
      price: 850.00
    },
    {
      ownerId: 2,
      address: '1 San Diego Street',
      city: 'San Diego',
      state: 'California',
      country: 'United States',
      lat: 32.86829,
      lng: -117.15637,
      name: 'Savor Panoramic Harbor',
      description: 'The views in our house are absolutely spectacular! The location is central to great restaurants, downtown SD, SeaWorld, and bay beaches where you can kayak or paddle board. It is a ideal choice for vacations and for business travelers looking for a comfortable place to call home while traveling.',
      price: 405.00
    },{
      ownerId: 2,
      address: '2 San Diego Street',
      city: 'San Diego',
      state: 'California',
      country: 'United States',
      lat: 32.86829,
      lng: -117.15637,
      name: 'Beachfront House',
      description: 'Our 4 bedroom and 2 bathroom house is on the beach with incredible ocean views including the Imperial Beach Pier. The open floor plan maximizes the views from the kitchen, living area and dining area. If youre looking for an awesome beach vacation, you found it!',
      price: 508.00
    },
    {
      ownerId: 3,
      address: '3 San Diego Street',
      city: 'San Diego',
      state: 'California',
      country: 'United States',
      lat: 32.86829,
      lng: -117.15637,
      name: 'Surf & Sand',
      description: 'This 3 bedroom home in South Mission Beach is just one house off the boardwalk and beach with a rooftop deck with lounges, a BBQ, outdoor dining, and panoramic views of the coast.',
      price: 354.00
    },
    {
      ownerId: 4,
      address: '1 Santa Barbara Boulevard',
      city: 'Santa Barbara',
      state: 'California',
      country: 'United States',
      lat: 34.42078,
      lng: -119.69975,
      name: 'Hollywood Beach Front',
      description: 'Stunning Hollywood Beach Ocean Front Home. This striking beauty is on a with 43 feet of beach sand frontage, a roof top deck. This astounding beach property has 6 large bedrooms, 5 with their own private bathrooms, 6 Full baths in total and a powder room.',
      price: 1125.00
    },
    {
      ownerId: 4,
      address: '2 Santa Barbara Boulevard',
      city: 'Santa Barbara',
      state: 'California',
      country: 'United States',
      lat: 34.42078,
      lng: -119.69975,
      name: 'Ocean Oasis',
      description: 'Welcome to the "Slot Machine House" in the charming Hollywood Beach community nestled halfway between Malibu and Santa Barbara. This is a one-of-a-kind luxury home is on Ocean Drive directly across from the beach. The home was designed by an architect in the Frank Lloyd School of Design and the goal was to make a house look like an object..the "Slot Machine House" was created! It has been "meticulously" updated in California Coastal style with modern amenities.',
      price: 541.00
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1,2,3,4] }
    }, {});
  }
};
