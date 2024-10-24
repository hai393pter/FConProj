import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.js';
import ApplicationConfig from './config/config.js';
import routes from './routes/index.js';
import setupAssociations from './Models/association.js';

// Import PayOS SDK
import PayOS from '@payos/node';

// Initialize PayOS with environment variables for security
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID, // Đảm bảo bạn đã thiết lập biến môi trường cho CLIENT_ID
  process.env.PAYOS_API_KEY,   // Đảm bảo bạn đã thiết lập biến môi trường cho API_KEY
  process.env.PAYOS_CHECKSUM_KEY // Đảm bảo bạn đã thiết lập biến môi trường cho CHECKSUM_KEY
);

// Express App Setup
const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
setupAssociations();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the routes defined in routes/index.js
routes.forEach(route => {
    app.use(route.path, route.router);
});

// PayOS create payment link route
app.post('/create-payment-link', async (req, res) => {
  const YOUR_DOMAIN = `https://pex-api.arisavinh.dev`; // Your domain
  const { order_id, amount, description, items } = req.body; // Allow client to pass these values

  const body = {
    order_id: order_id || Number(String(Date.now()).slice(-6)), // Generate order code if not provided
    amount: amount || 2000, // Default amount if not provided
    description: description || 'Thanh toán đơn hàng',
    items: items || [
      {
        name: 'Mì tôm Hảo Hảo ly',
        quantity: 1,
        price: 2000,
      },
    ],
    returnUrl: `${YOUR_DOMAIN}/payment-success`,
    cancelUrl: `${YOUR_DOMAIN}/payment-cancel`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    res.status(200).json({
      message: 'Redirect to payment',
      url: paymentLinkResponse.checkoutUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
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
const PORT = ApplicationConfig.development.api.port || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
