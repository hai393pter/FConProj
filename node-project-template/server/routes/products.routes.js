// routes/products.routes.js

import express from 'express';
const router = express.Router();
const productController = require('../controllers/products.controller');

// Lấy danh sách sản phẩm
router.get('/', productController.getAllProducts);

// Lấy chi tiết sản phẩm
router.get('/:id', productController.getProductById);

// Thêm sản phẩm mới (nếu có quyền)
router.post('/', productController.addProduct);

// Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

module.exports = router;
