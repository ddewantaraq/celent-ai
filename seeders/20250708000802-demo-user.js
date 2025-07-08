'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('password123', 10);
    return queryInterface.bulkInsert('Users', [
      {
        fullname: 'Admin User',
        email: 'admin@example.com',
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
  },
};
