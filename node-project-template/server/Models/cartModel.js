import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import User from './userModel'
class Cart extends Model {}

Cart.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
});

// Setting up associations
Cart.belongsTo(User, { foreignKey: 'userId' });

export default Cart;
