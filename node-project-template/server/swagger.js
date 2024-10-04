// swagger.js
import swaggerJsDoc from 'swagger-jsdoc';

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

export default swaggerDocs;
