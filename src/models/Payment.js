import { DataTypes, Model, Sequelize } from 'sequelize';

class Payment extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        rental_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        valor: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        data: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        metodo_pagamento: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'payments',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Rental, { foreignKey: 'rental_id', as: 'rental' });
  }
}

export default Payment;