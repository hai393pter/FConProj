// models/CareSchedule.js
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

class CareSchedule extends Model {}

CareSchedule.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    plant_id: {
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

module.exports = CareSchedule;
