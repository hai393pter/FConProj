import { config } from "dotenv";

config();

const ApplicationConfig = {
  development: {
    datastore: {
      database: process.env.DATABASE,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      options: {
        host: process.env.HOST,
        dialect: 'mysql',
        dialectOptions: {
          ssl: {
              rejectUnauthorized: true
          }
        }
      },
    },
    api: {
      port: process.env.PORT || 3000,
    }
  },
}

export default ApplicationConfig;
  