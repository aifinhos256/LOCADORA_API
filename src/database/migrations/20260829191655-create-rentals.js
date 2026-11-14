'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rentals', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'users', key: 'id' }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      veiculo_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'vehicles', key: 'id' }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data_inicio: {
        type: Sequelize.DATE,
        allowNull: false, 
      },
      data_fim: {
        type: Sequelize.DATE,
        allowNull: false, 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('rentals');
  },
};