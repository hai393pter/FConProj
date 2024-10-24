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
    user_name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_phone:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'shipping', 'delivered', 'cancelled'),
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
    shipping_fee: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0, // Default shipping fee
    },
    voucher_code: {
      type: DataTypes.STRING,
      allowNull: true, // Voucher code may be optional
    },
    discount_amount: {
      type: DataTypes.FLOAT,
      allowNull: true, // Discount applied from voucher
      defaultValue: 0.0,
    },
    note: {
      type: DataTypes.TEXT, // Customer's note
      allowNull: true,
    },
    shipping_address: {
      type: DataTypes.STRING, // Shipping address
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('COD', 'bank_transfer'), // Payment method: Cash On Delivery or Bank Transfer
      allowNull: false,
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
