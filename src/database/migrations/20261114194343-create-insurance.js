'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('insurances', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      aluguel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'rentals', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo_seguro: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'padrão'
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      valor: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('insurances')
  }
};
