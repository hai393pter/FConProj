import Order from '../Models/orderModel.js';
import Cart from '../Models/cartModel.js';
import Product from '../Models/productModel.js';

export const createOrder = async (req, res) => {
  const { user_id } = req.body;

  try {
    // Find the cart for the user (assuming 'not_paid' status is used for active cart items)
    const cartItems = await Cart.findAll({
      where: { user_id, status: 'not_paid' },
      include: [Product]
    });

    // Check if the cart is empty
    if (!cartItems.length) {
      return res.status(400).json({ statusCode: 400, data: { message: 'Cart is empty' } });
    }

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.Product.price, 0);

    // Create an order
    const order = await Order.create({
      user_id,
      total_price: totalPrice,
      status: 'pending',
      callback: '', // Add the appropriate callback URL if necessary
      order_date: new Date(),
    });

    // Associate cart items with the created order and update their status
    await Promise.all(cartItems.map(item => {
      return item.update({ 
        order_id: order.id, // Associate the cart item with the new order
        status: 'paid' // Mark the item as paid
      });
    }));

    // Prepare the order products response
    const orderProducts = cartItems.map(item => ({
      name: item.Product.name,
      imageUrl: item.Product.imageUrl,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    return res.status(200).json({
      statusCode: 200,
      data: {
        message: 'Order created successfully, Please Redirect To Payment',
        order,
        products: orderProducts
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      statusCode: 500, 
      data: { 
        message: 'Server error', 
        error: error.message 
      } 
    });
  }
};


// Get all orders for a user
export const getUserOrders = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Fetch all orders for the user
    const orders = await Order.findAll({
      where: { user_id },
      include: [
        {
          model: Cart, // Include Cart items associated with the order
          include: [
            {
              model: Product, // Include Product details
              attributes: ['name', 'imageUrl', 'price'], // Only return these fields from the Product model
            }
          ],
          attributes: ['quantity'], // Return quantity from the Cart model
        }
      ]
    });

    if (!orders || !orders.length) {
      return res.status(404).json({
        statusCode: 404,
        data: { message: 'No orders found for the user' }
      });
    }

    // Prepare the orders with product details
    const ordersWithDetails = orders.map(order => ({
      ...order.toJSON(), // Spread order data, convert to plain object
      products: order.Carts.map(cart => ({
        name: cart.Product?.name || 'Unknown', // Ensure product name exists
        imageUrl: cart.Product?.imageUrl || null, // Ensure imageUrl exists
        quantity: cart.quantity,
        price: cart.Product?.price || 0, // Ensure price exists
      }))
    }));

    // Return the orders along with product details
    return res.status(200).json({ statusCode: 200, data: ordersWithDetails });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      statusCode: 500,
      data: { message: 'Server error', error: error.message }
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(404).json({ statusCode: 404, data: { message: 'Order not found' } });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ statusCode: 200, data: { message: 'Order status updated successfully', order } });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ statusCode: 500, data: { message: 'Server error', error: error.message } });
  }
};

export default {
  createOrder,
  getUserOrders,
  updateOrderStatus
};
