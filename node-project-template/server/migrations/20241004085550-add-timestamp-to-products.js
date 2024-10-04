'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'timeStamp', {
      type: Sequelize.DATE, // Use Sequelize.DATE for a timestamp
      allowNull: true, // You can set this to false if required
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'timeStamp');
  },
};
