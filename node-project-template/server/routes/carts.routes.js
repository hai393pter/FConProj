// routes/carts.routes.js

import express from 'express';
const router = express.Router();
const cartController = require('../controllers/carts.controller');

// Lấy danh sách sản phẩm trong giỏ hàng
router.get('/:userId', cartController.getCartItems);

// Thêm sản phẩm vào giỏ hàng
router.post('/:userId/add', cartController.addToCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:userId/remove/:productId', cartController.removeFromCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/:userId/update/:productId', cartController.updateCartItem);

module.exports = router;
