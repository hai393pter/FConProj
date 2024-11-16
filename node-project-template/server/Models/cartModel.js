import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js';
import User from './userModel.js';
import Product from './productModel.js';
import Order from './orderModel.js';

class Cart extends Model {
  // Custom setter for createdAt
set createdAt(value) {
  // Add 7 hours to the input value
  const vnDate = new Date(new Date(value).getTime() + (7 * 60 * 60 * 1000));
  this.setDataValue('createdAt', vnDate);
}

// Custom setter for updatedAt
set updatedAt(value) {
  // Add 7 hours to the input value
  const vnDate = new Date(new Date(value).getTime() + (7 * 60 * 60 * 1000));
  this.setDataValue('updatedAt', vnDate);
}
}

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
  order_id: {  // Thêm cột order_id
    type: DataTypes.INTEGER,
    references: {
      model: Order, // Bảng `Order`
      key: 'id',
    },
    allowNull: true,  // Khi giỏ hàng chưa được thanh toán, có thể chưa có order_id
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
Cart.belongsTo(Product, { foreignKey: 'product_id' });

export default Cart;
