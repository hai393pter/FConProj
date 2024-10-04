import { config } from "dotenv";

config();

const ApplicationConfig = {
  development: {
    datastore: {
      database: process.env.DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      options: {
        host: process.env.DB_HOST,
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
  