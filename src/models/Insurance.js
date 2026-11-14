import Sequelize, { Model } from 'sequelize';

class Insurance extends Model {
    static init(sequelize) {
        super.init(
            {
                tipo_seguro: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: 'padrão'
                },
                status: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                valor: {
                    type: Sequelize.FLOAT,
                    allowNull: false
                }
            },


            { sequelize })
    }

    static associate(models){
        this.belongsTo(models.Rental, {foreignKey: 'aluguel_id', as: 'aluguel'})
    }

    
}
export default Insurance;