'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-53503031/original/c1ba9b61-6b71-430d-add1-69d1ab8b2b6e.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-53503031/original/bcf09f4a-7740-42e7-9502-1c78e1e99c3d.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-53503031/original/6efad34f-3edd-4209-a37d-c781b162f6de.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-53503031/original/6bef68fc-11e5-467e-9781-68d7753c7dd9.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-53503031/original/5872d373-ec00-4952-9db3-4fe3b22a3e1c.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-53503031/original/1ec27275-756e-478f-95d7-a7c057265336.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/09323f1f-3054-4591-8038-50bbfaad5e44.jpg?im_w=1200',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/1f587915-be35-4243-9336-8861a7c66789.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/43158576-4747-4577-bc03-bf71644eb0df.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/afee2e3b-1f8b-4a7e-83fc-1cd52ee9981b.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-9756932/original/b8905aa8-b2b8-4ba2-8e2b-4d4cc2601b22.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/13f79bef-3254-460c-915e-393d744a7841.jpg?im_w=1200',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-52487462/original/5bec452d-89c8-4f29-aeef-af5259560c5c.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-52487462/original/18345ea5-0ef5-48c9-a5d3-bef0141ab77b.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-52487462/original/22211ff5-61e5-42f5-b9a0-0c7dc0430109.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-52487462/original/a669fda6-e05e-4de4-9d10-3d78f8f5df93.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-52487462/original/d631d7af-8f46-4c54-9c8f-84c491571252.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://a0.muscache.com/im/pictures/adc4e75f-e76b-46be-a76b-67295c77afec.jpg?im_w=1200',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://a0.muscache.com/im/pictures/0fcf7c68-4bfa-4f29-a1b0-991b947056bc.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://a0.muscache.com/im/pictures/609c430f-e5f7-4244-848b-3b974f270a7d.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://a0.muscache.com/im/pictures/0f0b2a95-6102-46a0-956c-5a5ded2bc18f.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://a0.muscache.com/im/pictures/ab22e39f-2177-4b88-a3b2-3ce7f8da2711.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/24cc004e-3a29-4f11-83f3-3afe1b2d28c4.jpg?im_w=1200',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/da5d084d-9e33-4444-8369-8aff122fd170.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/5b7cdd08-6064-40e3-95bd-6d380d5f5f03.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/8b1281d5-fd28-408d-bce0-6c23a53ca6c2.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/47943b88-506a-4ec5-a5f9-69f2b822e536.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-11087518/original/a7230bfb-b1b5-4125-8a08-e04d4bdfbe7d.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-11087518/original/331df6c7-b897-4d17-9a85-73772b3e9543.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-11087518/original/f88d4f6b-c034-419a-8487-859e43400cd6.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-11087518/original/b90ffe54-3b51-41ca-924a-f7c2f835ce1f.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-11087518/original/0e6f5e44-9e08-4528-a5b0-1db5b37ce35e.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://a0.muscache.com/im/pictures/6ff3d23e-8b89-4b36-bbfb-3b6622587233.jpg?im_w=1200',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://a0.muscache.com/im/pictures/a46ecb5c-7222-4605-83ee-3a6b4370c15c.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://a0.muscache.com/im/pictures/8410f494-b635-4d47-8907-ee1f74a95723.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://a0.muscache.com/im/pictures/aaf684a8-1efe-4fac-965d-b53d719adf63.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://a0.muscache.com/im/pictures/77ef857b-539b-4237-bcff-100c1172817b.jpg?im_w=720',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://a0.muscache.com/im/pictures/f24b1814-7659-4f16-a08e-3fa9a93fe122.jpg?im_w=1200',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-49550862/original/5dffbb69-0857-4762-a86d-d26987da11cf.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-49550862/original/d5326333-4b45-4432-9f84-da2625a4ec96.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-49550862/original/f4c41807-a90f-40e3-8510-620e3fdc6806.jpeg?im_w=720',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-49550862/original/0a469c8b-019b-43a4-939b-a16541927875.jpeg?im_w=720',
        preview: false
      },


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
