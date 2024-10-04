// swagger.js
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerAutogen from 'swagger-autogen';
import express from 'express';

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for my Express project',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
        servers: [
            {
                url: '/',
            },
        ],
    
    apis: ['./routes/*.js'], // Đường dẫn đến các file chứa các định nghĩa API (điều chỉnh theo dự án của bạn)
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
