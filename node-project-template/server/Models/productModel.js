import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Đảm bảo đường dẫn đúng

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
        allowNull: false, // Đảm bảo trường này không được null
    },
});

export default Product;
