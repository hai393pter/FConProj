import express from 'express';
import productsControllers from '../Controllers/product.controllers.js'; // Đảm bảo rằng đường dẫn đúng
import checkAuth from '../middlewares/checkAuth.middleware.js'; // Nếu bạn muốn kiểm tra xác thực cho các phương thức này
import routers from './users.routes.js';

const routers = express.Router();

// Tạo sản phẩm mới
routers.post('/', checkAuth, productsControllers.createProduct);

// Kiểm tra thông tin sản phẩm theo ID
routers.get('/:id', productsControllers.getProduct);

// Chỉnh sửa thông tin sản phẩm theo ID
routers.put('/:id', checkAuth, productsControllers.updateProduct);

// Xuất router
export default routers;
