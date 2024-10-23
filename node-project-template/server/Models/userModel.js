import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isPhone: true,
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAddress: true, 
            },
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reset_password_token: {
            type: DataTypes.STRING,
            allowNull: true, // This field is nullable, only populated when resetting password
        },
        reset_password_expires: {
            type: DataTypes.DATE,
            allowNull: true, // Expiration date for the reset token
        },
    },
    {
        modelName: 'User',
        tableName: 'users',
        timestamps: true, // Enables createdAt and updatedAt fields
        sequelize
    }
);

export default User;
