import Order from '../Models/orderModel.js';
import Cart from '../Models/cartModel.js';
import Product from '../Models/productModel.js';
import User from '../Models/userModel.js';
import Status from '../Models/Status.js';
import { or } from 'sequelize';
import { Op } from 'sequelize';

const convertToVNTime = (date) => {
  const vnTimeOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
  return new Date(new Date(date).getTime() + vnTimeOffset).toISOString();
};


// Create order
export const createOrder = async (req, res) => {
  const { user_id, user_name, user_phone, shipping_fee, payment_method, note, shipping_address } = req.body;

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
      user_name,
      user_phone,
      total_price: totalPrice + shipping_fee, // Include shipping fee in the total price
      status: 'pending',
      callback: '', // Add the appropriate callback URL if necessary
      order_date: new Date(),
      shipping_fee,
      note,
      shipping_address,
      payment_method
    });

    // Associate cart items with the created order and update their status
    await Promise.all(cartItems.map(item => {
      return item.update({ 
        order_id: order.id, // Associate the cart item with the new order
        status: 'paid' // Mark the item as paid
      });
    }));

    // Xóa tất cả sản phẩm trong giỏ hàng sau khi đặt hàng
    await Cart.destroy({
      where: { user_id, status: 'not_paid' }
    });

    // Prepare the order products response
    const orderProducts = cartItems.map(item => ({
      name: item.Product.name,
      imageUrl: item.Product.imageUrl,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    // Convert dates to VN time
    const orderResponse = {
      ...order.toJSON(),
      createdAt: convertToVNTime(order.createdAt),
      updatedAt: convertToVNTime(order.updatedAt),
      order_date: convertToVNTime(order.order_date),
    };

    return res.status(200).json({
      statusCode: 200,
      data: {
        message: 'Order created successfully, Please Redirect To Payment',
        order: orderResponse,
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
      return res.status(200).json({
        statusCode: 200,
        data: { message: 'No orders found for the user' }
      });
    }

    // Prepare the orders with product details
    const ordersWithDetails = orders.map(order => ({
      ...order.toJSON(), // Spread order data, convert to plain object
      createdAt: convertToVNTime(order.createdAt),
      updatedAt: convertToVNTime(order.updatedAt),
      order_date: convertToVNTime(order.order_date),
      products: order.Carts.map(cart => ({
        name: cart.Product?.name || 'Unknown', // Ensure product name exists
        imageUrl: cart.Product?.imageUrl || null, // Ensure imageUrl exists
        quantity: cart.quantity,
        price: cart.Product?.price || 0, // Ensure price exists
      })),
      user_name: order.user_name, //Return user's name
      user_phone: order.user_phone, //Return user's phone
      shipping_fee: order.shipping_fee, // Return shipping fee
      note: order.note, // Return note
      shipping_address: order.shipping_address, // Return shipping address
      payment_method: order.payment_method // Return payment method
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


//Get all orders

// Controller function to get all orders
// Controller function to get all orders, with optional email filter
export const getAllOrders = async (req, res) => {
  const { email, orderId, listStatus, page = 1, limit = 10 } = req.query; // Get the filters and pagination params from query

  try {
    // Convert page and limit to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Validate page and limit
    if (isNaN(pageInt) || isNaN(limitInt) || pageInt <= 0 || limitInt <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid page or limit parameter',
      });
    }

    // Start building the query
    let whereClause = {};

    // If email is provided, filter by user's email
    if (email) {
      const user = await User.findOne({
        where: { email: { [Op.like]: `%${email}%` } }, // Filter users by email (LIKE query)
      });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: 'User not found with the given email',
        });
      }

      // If user is found, filter orders by user_id
      whereClause.user_id = user.id;
    }

    // If orderId is provided, filter by orderId
    if (orderId) {
      whereClause.id = orderId;
    }

    // If listStatus is provided, filter by status
    if (listStatus) {
      const statusArray = listStatus.split(',');  // Convert the listStatus string to an array
      whereClause.status = { [Op.in]: statusArray };  // Filter by multiple statuses
    }

    // Calculate the offset for pagination
    const offset = (pageInt - 1) * limitInt;

    // Fetch orders with associated user and cart data, apply pagination
    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,  // Apply all filters (email, orderId, status)
      include: [
        {
          model: Cart,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'imageUrl', 'price'],
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'name', 'phone'], // Include necessary fields from User
        },
      ],
      limit: limitInt,    // Limit the number of results per page
      offset: offset,     // Pagination offset
    });

    // Calculate total revenue (total_price) for the orders
    const totalRevenue = rows.reduce((sum, order) => {
      return sum + parseFloat(order.total_price) || 0;  // Ensure that total_price is treated as a number
    }, 0);

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limitInt);

    return res.status(200).json({
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: {
        content: rows,
        totalRevenue: totalRevenue.toFixed(2),  // Round to 2 decimal places
        pagination: {
          currentPage: pageInt,
          totalPages,
          totalElements: count,
          limit: limitInt,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching orders',
      error: error.message,
    });
  }
};



// API tính tổng số đơn hàng
export const getTotalOrders = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Kiểm tra nếu user_id là 'count' (trường hợp tổng số đơn hàng)
    if (user_id === 'count') {
      // Lấy tổng số đơn hàng
      const { count } = await Order.findAndCountAll(); // Không lọc theo user_id mà lấy tổng đơn hàng
      return res.status(200).json({
        statusCode: 200,
        message: 'Total orders count retrieved successfully',
        data: { totalOrders: count },
      });
    }

    // Nếu user_id không phải là 'count', lấy đơn hàng của người dùng cụ thể
    const orders = await Order.findAll({
      where: { user_id },
      include: [
        {
          model: Cart,
          include: [
            {
              model: Product,
              attributes: ['name', 'imageUrl', 'price'],
            }
          ],
          attributes: ['quantity'],
        }
      ]
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        data: { message: 'No orders found for the user' }
      });
    }

    const ordersWithDetails = orders.map(order => ({
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
    }));

    return res.status(200).json({
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: ordersWithDetails,
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Server error',
      error: error.message,
    });
  }
};










export default {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
  getTotalOrders
};
