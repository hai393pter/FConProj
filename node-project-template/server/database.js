import { Sequelize } from "sequelize";
import ApplicationConfig from './config/config.js';

const connection =  ApplicationConfig.development.datastore;
// Sequelize Setup
const sequelize = new Sequelize(connection.database, connection.username, connection.password, {
    host: connection.options.host,
    dialect: connection.options.dialect,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true
        }
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('MySQL Database Connected Successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the MySQL database:', err);
});

export default sequelize;
