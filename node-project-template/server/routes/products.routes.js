import express from 'express';
import productsControllers from '../Controllers/product.controllers.js'; // Đảm bảo rằng đường dẫn đúng
import checkAuth from '../middlewares/checkAuth.middleware.js'; // Nếu bạn muốn kiểm tra xác thực cho các phương thức này
import routers from './users.routes.js';
import checkImageUrl from '../middlewares/checkImageUrl.middleware.js';

const productRouter = express.Router();

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 productId:
 *                   type: integer
 *       500:
 *         description: Error creating product
 */
productRouter.post('/', checkAuth, checkImageUrl, productsControllers.createProduct);

/**
 * @openapi
 * /products/filter:
 *   get:
 *     summary: Filter products based on query parameters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category of the products to filter by
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price of the products
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price of the products
 *     responses:
 *       200:
 *         description: A list of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   description:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *       500:
 *         description: Error filtering products
 */
productRouter.get('/filter', productsControllers.filterProducts);

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
productRouter.get('/:id', productsControllers.getProduct);

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
 *               category:
 *                 type: string
 *                 description: Category of the product
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
productRouter.put('/:id', checkAuth,checkImageUrl, productsControllers.updateProduct);
/**
 * @openapi
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category of the products to filter by
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price of the products
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price of the products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   description:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *       500:
 *         description: Error fetching products
 */
productRouter.get('/', productsControllers.getAllProducts);


// Xuất router
export default productRouter;
