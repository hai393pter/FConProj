import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Đảm bảo đường dẫn đúng
import moment from 'moment-timezone';

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return moment(this.getDataValue('createdAt')).tz('Asia/Bangkok').format();
        }
    },updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return moment(this.getDataValue('updatedAt')).tz('Asia/Bangkok').format();
        }
    },
    timeStamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return moment(this.getDataValue('timeStamp')).tz('Asia/Bangkok').format();
        }
    }
}, {
    sequelize, // instance of Sequelize
    modelName: 'Product',
    tableName: 'products',
    timestamps: true, // Enable timestamps
});

export default Product;
