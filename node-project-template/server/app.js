import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.js';

// Routes
import usersRouter from './routes/users.routes.js';
import adminRouter from './routes/admin.routes.js';
import productsRouter from './routes/products.routes.js';
import ApplicationConfig from './config/config.js';

// Express App Setup
const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


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
const PORT = ApplicationConfig.development.api.port;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
