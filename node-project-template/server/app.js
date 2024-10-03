import express from 'express';
import logger from 'morgan';
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

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

// Express App Setup
const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
const PORT = process.env.PORT || 3000; // Use the PORT defined in your environment or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
