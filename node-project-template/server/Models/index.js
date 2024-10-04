const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('qldb', 'FConnectAdmin', 'FConnectRoot', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Product = sequelize.define('Product', {
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

// Kết nối đến database và đồng bộ các models
sequelize.sync();

export default   {User, Product};
