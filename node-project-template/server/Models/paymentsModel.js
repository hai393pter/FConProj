import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js'; // Import sequelize instance

class Payment extends Model {
  // Custom setter for payment_date
  set payment_date(value) {
    const vnDate = new Date(new Date(value).getTime() + (7 * 60 * 60 * 1000));
    this.setDataValue('payment_date', vnDate);
  }

  // Custom setter for createdAt
  set createdAt(value) {
    const vnDate = new Date(new Date(value).getTime() + (7 * 60 * 60 * 1000));
    this.setDataValue('createdAt', vnDate);
  }

  // Custom setter for updatedAt
  set updatedAt(value) {
    const vnDate = new Date(new Date(value).getTime() + (7 * 60 * 60 * 1000));
    this.setDataValue('updatedAt', vnDate);
  }

  // Custom setter for transactionDate
  set transactionDate(value) {
    const vnDate = new Date(new Date(value).getTime() + (7 * 60 * 60 * 1000));
    this.setDataValue('transactionDate', vnDate);
  }
}

// Define the Payment model
Payment.init(
  {
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
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
  }
);

// Sync model with the database
Payment.sync();

export default Payment;
