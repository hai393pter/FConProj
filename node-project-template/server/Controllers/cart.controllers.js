import dotenv from 'dotenv';
dotenv.config();
import Cart from '../Models/cartModel.js';
import User from '../Models/userModel.js';
import Product from '../Models/productModel.js';

// Create a new cart
export const createCart = async (req, res) => {
  console.log('Request to create cart received');
  const { user_id, product_id } = req.body;

  try {
    // Validate user existence
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(200).json({ statusCode: 200, message: 'Không tìm thấy người dùng' });
    }

    if (!product_id) {
      return res.status(400).json({ statusCode: 400, message: 'Hãy nhập mã sản phẩm' });
    }

    // Create a new cart
    const newCart = await Cart.create({ user_id, product_id });
    console.log('Giỏ hàng đã được tạo với mã:', newCart.id);

    return res.status(200).json({ statusCode: 200, message: 'Giỏ hàng đã được tạo thành công', data: { cartId: newCart.id } });
  } catch (error) {
    console.error('Có lỗi khi tạo giỏ hàng:', error);
    return res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};

// Get a user's cart with product details
export const getCart = async (req, res) => {
  const { user_id } = req.params; // Expect userId as a route parameter

  try {
    // Find the user's cart and include product details
    const cart = await Cart.findAll({
      where: { user_id },
      include: [
        {
          model: Product, // Assuming you have a Product model
          attributes: ['id', 'name', 'price', 'description','imageUrl'], // Specify the fields you want from the Product model
        },
      ],
    });

    if (!cart || cart.length === 0) {
      return res.status(200).json({ statusCode: 200, message: 'Không thể tìm thấy giỏ hàng' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Giỏ hàng đã được lấy thành công',
      data: cart, // This will now include product information for each cart item
    });
  } catch (error) {
    console.error('Có lỗi khi lấy giỏ hàng:', error);
    return res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};


export const addProductToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // Validate user existence
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy người dùng' });
    }

    // Validate product existence
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(400).json({ statusCode: 400, message: 'Không tìm thấy sản phẩm' });
    }

    // Check if the cart already exists
    let existingCartItem = await Cart.findOne({ where: { user_id, product_id } });

    if (existingCartItem) {
      // Update quantity if the product is already in the cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      // Create a new cart if it doesn't exist
      const newCart = await Cart.create({ user_id, product_id, quantity });
    }

    return res.status(200).json({ 
      statusCode: 200, 
      message: 'Sản phẩm đã được thêm vào giỏ hàng' 
    });
  } catch (error) {
    console.error('Có lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    return res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};



// Update a cart (add items, etc.)
export const updateCart = async (req, res) => {
  const { cartId } = req.params; // Expect cartId as a route parameter
  const { product_id, quantity } = req.body; // Expect product_id and quantity to update the cart

  try {
    // Find the cart by cartId
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) {
      return res.status(200).json({ statusCode: 200, message: 'Không tìm thấy giỏ hàng' });
    }

    // Update cart item
    cartItem.quantity = quantity; // Update quantity
    cartItem.product_id = product_id; // Update product ID (optional)
    
    await cartItem.save();

    // After updating, include product information
    const updatedCartItem = await Cart.findOne({
      where: { id: cartId },
      include: [
        {
          model: Product, // Assuming you have a Product model associated with Cart
          attributes: ['id', 'name', 'price', 'description', 'imageUrl'], // Specify the fields you want to include from Product
        },
      ],
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Giỏ hàng đã được cập nhật',
      data: updatedCartItem, // This will include the updated cart item and its product details
    });
  } catch (error) {
    console.error('Có lỗi khi cập nhật giỏ hàng', error);
    return res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};


// Delete a cart
export const deleteCart = async (req, res) => {
  const { cartId } = req.params; // Expect cartId as a route parameter

  try {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(200).json({ statusCode: 200, message: 'Không tìm thấy giỏ hàng' });
    }

    await cart.destroy(); // Deletes the cart

    // Return success message after deletion
    return res.status(200).json({
      statusCode: 200,
      data: {
        message: 'Giỏ hàng đã được xóa thành công'
      }
    });
  } catch (error) {
    console.error('Có lỗi khi xóa giỏ hàng', error);
    return res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};


// Export all controllers
export default {
  createCart,
  getCart,
  updateCart,
  deleteCart,
  addProductToCart,
};
