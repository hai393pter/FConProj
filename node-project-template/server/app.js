import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.js';

// Routes
import ApplicationConfig from './config/config.js';

import routes from './routes/index.js'

// Express App Setup
const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

routes.forEach(route => {
    app.use(route.path, route.router);
});


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
    res.status(404).json({
        message: "No such route exists"
    });
});

// Error handler
app.use(function(err, req, res, next) {
    if (!res.headersSent) {
        res.status(err.status || 500).json({
            message: err.message || 'Internal server error',
        });
    }
});

// Start the server
const PORT = ApplicationConfig.development.api.port;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
