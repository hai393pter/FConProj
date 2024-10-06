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
    console.log('Received userId:', user_id);
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    if (!product_id) {
      return res.status(400).json({ message: 'Hãy nhập mã sản phẩm' });
    }



    // Create a new cart
    const newCart = await Cart.create({ user_id, product_id });
    console.log('Giỏ hàng đã được tạo với mã:', newCart.id);

    return res.status(201).json({ message: 'Giỏ hàng đã được tạo thành công', cartId: newCart.id });
  } catch (error) {
    console.error('Có lỗi khi tạo giỏ hàng:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a user's cart
export const getCart = async (req, res) => {
  const { user_id } = req.params; // Expect userId as a route parameter

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ where: { user_id } });

    if (!cart) {
      return res.status(404).json({ message: 'Không thể tìm thấy giỏ hàng' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Có lỗi khi lấy giỏ hàng:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const addProductToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // Validate product existence
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Check if the cart item already exists
    let existingCartItem = await Cart.findOne({ where: { user_id, product_id } });

    if (existingCartItem) {
      // Update quantity if the product is already in the cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Sản phẩm đã được cập nhật trong giỏ hàng', cartItem: existingCartItem });
    } else {
      // Create a new cart item if it doesn't exist
      const newCartItem = await CartItem.create({ user_id, product_id, quantity });
      return res.status(201).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng', cartItem: newCartItem });
    }
  } catch (error) {
    console.error('Có lỗi khi thêm sản phẩm vào giỏ hàng', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a cart (add items, etc.)
export const updateCart = async (req, res) => {
  const { cartId } = req.params; // Expect cartId as a route parameter
  const { items } = req.body; // Expect items array to update the cart

  try {
    // Find the cart by id
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    // Update cart items (Assuming you have an 'items' field in the Cart model)
    // Here you can implement logic to add/remove items
    cart.items = items; // Update with new items (you should implement the actual logic here)

    await cart.save();

    return res.status(200).json({ message: 'Giỏ hàng đã được cập nhật', cart });
  } catch (error) {
    console.error('Có lỗi khi cập nhật giỏ hàng', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a cart
export const deleteCart = async (req, res) => {
  const { cartId } = req.params; // Expect cartId as a route parameter

  try {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    await cart.destroy(); // Deletes the cart

    return res.status(204).json(); // No content to return after deletion
  } catch (error) {
    console.error('Có lỗi khi xóa giỏ hàng', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
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
