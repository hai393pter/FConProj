import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js'; // Đảm bảo đường dẫn đúng
import moment from 'moment-timezone';

class Product extends Model {}

Product.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
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
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'hộp', // Đặt giá trị mặc định là 'hộp'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            get() {
                return moment(this.getDataValue('createdAt')).tz('Asia/Bangkok').format();
            }
        },
        updatedAt: {
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
    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true, // Enable timestamps
    }
)

export default Product;
