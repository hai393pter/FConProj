// controllers/carts.controller.js

import Cart from '../../../Models/cartModel'; // Giả định đã có model Cart
import Product from '../../../Models/productModel'; // Giả định đã có model Product


// Lấy danh sách sản phẩm trong giỏ hàng của người dùng
exports.getCartItems = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.params.userId;

        // Tìm sản phẩm
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Tìm giỏ hàng
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            // Nếu chưa có giỏ hàng, tạo mới
            cart = new Cart({ userId, items: [] });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex > -1) {
            // Nếu có, cập nhật số lượng
            cart.items[cartItemIndex].quantity += quantity;
        } else {
            // Nếu chưa, thêm sản phẩm vào giỏ hàng
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công', cart });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng', error });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công', cart });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
        }

        const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex > -1) {
            cart.items[cartItemIndex].quantity = quantity;
        } else {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }

        await cart.save();
        res.status(200).json({ message: 'Cập nhật sản phẩm trong giỏ hàng thành công', cart });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm trong giỏ hàng', error });
    }
};
