import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Import sequelize instance

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  paymentStatus:{
    type: DataTypes.STRING,
    defaultValue: 'pending',
    allowNull: false,
  },
  transactionDate:{
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Sync model with the database
Payment.sync();

export default Payment;
