// models/CareSchedule.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';

class CareSchedule extends Model {}

CareSchedule.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Plants',
            key: 'id',
        },
    },
    task_type: {
        type: DataTypes.ENUM('water', 'fertilize', 'prune', 'repot'),
        allowNull: false,
    },
    task_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'CareSchedule',
    tableName: 'CareSchedules',
    timestamps: false,
});

export default CareSchedule;
