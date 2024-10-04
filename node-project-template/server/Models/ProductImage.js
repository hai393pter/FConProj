// models/ProductImage.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';


class ProductImage extends Model {}

ProductImage.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'productimages',
    timestamps: false,
});

export default ProductImage;
