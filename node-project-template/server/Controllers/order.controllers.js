import Order from '../Models/orderModel.js';
import Cart from '../Models/cartModel.js';
import Product from '../Models/productModel.js';

// Create an order
export const createOrder = async (req, res) => {
  const { user_id } = req.body;

  try {
    // Find the cart for the user
    const cartItems = await Cart.findAll({ where: { user_id }, include: [Product] });

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.Product.price, 0);

    // Create an order
    const order = await Order.create({
      user_id,
      total_price: totalPrice,
      status: 'pending', // default status
      order_date: new Date(), // order date
    });

    return res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  const { user_id } = req.params;

  try {
    const orders = await Order.findAll({ where: { user_id } });
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for the user' });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default {createOrder, 
                getUserOrders, 
                updateOrderStatus

}