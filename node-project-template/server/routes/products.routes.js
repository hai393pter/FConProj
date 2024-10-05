import express from 'express';
import productsControllers from '../Controllers/product.controllers.js'; // Đảm bảo rằng đường dẫn đúng
import checkAuth from '../middlewares/checkAuth.middleware.js'; // Nếu bạn muốn kiểm tra xác thực cho các phương thức này
import routers from './users.routes.js';
import checkImageUrl from '../middlewares/checkImageUrl.middleware.js';

const router = express.Router();

// Tạo sản phẩm mới
/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Tạo sản phẩm mới
 *     description: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               price:
 *                 type: number
 *                 description: The price of the product
 *               description:
 *                 type: string
 *                 description: A description of the product
 *               imageUrl:
 *                 type: string
 *                 description: Url to image
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request, validation error
 */

router.post('/', checkAuth, checkImageUrl, productsControllers.createProduct);

// Kiểm tra thông tin sản phẩm theo ID
/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Kiểm tra thông tin sản phẩm theo ID
 *     description: Get product information by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product
 *         schema:
 *           type: integer
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The product ID
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                 price:
 *                   type: number
 *                   description: The price of the product
 *                 description:
 *                   type: string
 *                   description: A description of the product
 *       404:
 *         description: Product not found
 */
router.get('/:id', productsControllers.getProduct);

// Chỉnh sửa thông tin sản phẩm theo ID

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Chỉnh sửa thông tin sản phẩm theo ID
 *     description: Update product information by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               price:
 *                 type: number
 *                 description: The price of the product
 *               description:
 *                 type: string
 *                 description: A description of the product
 *               imageUrl:
 *                 type: string
 *                 description: Image URL
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request, validation error
 */
router.put('/:id', checkAuth,checkImageUrl, productsControllers.updateProduct);

// Xuất router
export default router;
