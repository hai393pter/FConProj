// Import necessary models
import Order from '../Models/orderModel.js';
import Product from '../Models/productModel.js';
import Cart from '../Models/cartModel.js';

// Controller to fetch dashboard metrics
export const getDashboardMetrics = async (req, res) => {
  try {
    // Fetch total count of orders
    const totalOrders = await Order.count();

    // Fetch total count of products
    const totalProducts = await Product.count();

    // Calculate total revenue only from orders with valid status
    const validStatuses = ['delivered', 'shipping', 'pending']; // Define valid statuses
    const totalRevenue = await Order.sum('total_price', {
      where: {
        status: validStatuses
      }
    });

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

const convertToVNTime = (date) => {
  const vnTimeOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
  return new Date(new Date(date).getTime() + vnTimeOffset).toISOString();
};

// Controller to fetch order details by order_id
export const getOrderDetail = async (req, res) => {
  const { order_id } = req.params;

  try {
    // Find the order by ID
    const order = await Order.findOne({
      where: { id: order_id },
      include: [
        {
          model: Cart,
          include: [
            {
              model: Product,
              attributes: ['name', 'imageUrl', 'price'], // Include necessary product fields
            }
          ],
          attributes: ['quantity'], // Include cart fields
        }
      ]
    });

    // If order not found
    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        data: { message: 'Order not found' },
      });
    }

    // Transform the order details
    const orderDetails = {
      ...order.toJSON(),
      createdAt: convertToVNTime(order.createdAt),
      updatedAt: convertToVNTime(order.updatedAt),
      order_date: convertToVNTime(order.order_date),
      products: order.Carts.map(cart => ({
        name: cart.Product?.name || 'Unknown',
        imageUrl: cart.Product?.imageUrl || null,
        quantity: cart.quantity,
        price: cart.Product?.price || 0,
      })),
      user_name: order.user_name,
      user_phone: order.user_phone,
      shipping_fee: order.shipping_fee,
      note: order.note,
      shipping_address: order.shipping_address,
      payment_method: order.payment_method,
    };

    // Return the order details
    return res.status(200).json({
      statusCode: 200,
      data: orderDetails,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return res.status(500).json({
      statusCode: 500,
      data: { message: 'Server error', error: error.message },
    });
  }
};

export default{
  getDashboardMetrics,
  getOrderDetail
}