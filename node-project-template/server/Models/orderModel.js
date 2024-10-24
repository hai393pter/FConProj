import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';

class Order extends Model {
set order_date(value) {
  // Add 7 hours (7 * 60 * 60 * 1000 milliseconds) to the input value
  const vnDate = new Date(new Date(value).getTime() + (7 * 60 * 60 * 1000));
  this.setDataValue('order_date', vnDate);
}

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
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    callback: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  }
);


export default Order;
