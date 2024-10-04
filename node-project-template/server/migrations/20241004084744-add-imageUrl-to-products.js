'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: false,  // Ensure it's required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'imageUrl');
  }
};

