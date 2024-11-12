// dashboard.controller.js

// Import necessary models
import Order from '../Models/orderModel.js';
import Product from '../Models/productModel.js';

// Controller to fetch dashboard metrics
export const getDashboardMetrics = async (req, res) => {
  try {
    // Fetch total count of orders
    const totalOrders = await Order.count();

    // Fetch total count of products
    const totalProducts = await Product.count();

    // Calculate total revenue from all orders
    const totalRevenue = await Order.sum('total_price');

    // Return metrics as a JSON response
    return res.status(200).json({
      statusCode: 200,
      data: {
        totalOrders,
        totalProducts,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return res.status(500).json({
      statusCode: 500,
      data: { message: 'Server error', error: error.message }
    });
  }
};
