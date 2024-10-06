import dotenv from 'dotenv';
dotenv.config();
import Cart from '../Models/cartModel.js'; 
import User from '../Models/userModel.js'; 


// Create a new cart
export const createCart = async (req, res) => {
    console.log('Request to create cart received'); 
  const { userId } = req.body;

  try {
    // Validate user existence
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new cart
    const newCart = await Cart.create({ userId });

    return res.status(201).json({ message: 'Cart created successfully', cartId: newCart.id });
  } catch (error) {
    console.error('Error creating cart:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a user's cart
export const getCart = async (req, res) => {
  const { userId } = req.params; // Expect userId as a route parameter

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
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
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Update cart items (Assuming you have an 'items' field in the Cart model)
    // Here you can implement logic to add/remove items
    cart.items = items; // Update with new items (you should implement the actual logic here)

    await cart.save();

    return res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a cart
export const deleteCart = async (req, res) => {
  const { cartId } = req.params; // Expect cartId as a route parameter

  try {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.destroy(); // Deletes the cart

    return res.status(204).json(); // No content to return after deletion
  } catch (error) {
    console.error('Error deleting cart:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all controllers
export default {
  createCart,
  getCart,
  updateCart,
  deleteCart,
};
