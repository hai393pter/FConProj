import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js';
import User from './userModel.js';
import Product from './productModel.js';
class Cart extends Model {}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.ENUM('paid', 'not_paid'),
    defaultValue: 'not_paid',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'cartitems',
  timestamps: true,
});

// Setting up associations
Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id'});

export default Cart;
