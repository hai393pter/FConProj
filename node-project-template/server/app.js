import express from 'express';
import logger from 'morgan';
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerDocument from './swagger.js';



// Routes
import usersRouter from './routes/users.routes.js';
import adminRouter from './routes/admin.routes.js';
import productsRouter from './routes/products.routes.js';

config(); // Load environment variables

// Sequelize Setup
const sequelize = new Sequelize('qldb', 'FConnectAdmin', 'FConnectRoot', {
    host: 'localhost',
    dialect: 'mysql', // Use MySQL
});
// Cấu hình Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API information',
        },
    },
    apis: ['server/routes/*.js'], // Đường dẫn đến các file routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);



// Express App Setup
const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Thêm middleware Swagger
// Cấu hình Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Sequelize Database Connection
sequelize.authenticate()
    .then(() => {
        console.log('MySQL Database Connected Successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the MySQL database:', err);
    });


app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/products', productsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).json({
        message: "No such route exists"
    });
});

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: "Error Message"
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
