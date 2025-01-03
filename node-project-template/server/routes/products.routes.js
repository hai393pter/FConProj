import express from 'express';
import productsControllers from '../Controllers/product.controllers.js'; // Đảm bảo rằng đường dẫn đúng
import checkAuth from '../middlewares/checkAuth.middleware.js'; // Nếu bạn muốn kiểm tra xác thực cho các phương thức này
import checkImageUrl from '../middlewares/checkImageUrl.middleware.js';

const productRouter = express.Router();

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Tạo sản phẩm mới
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
 *         description: Sản phẩm đã được tạo
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
 *     summary: Tìm sản phẩm bằng filter
 *     tags: [Products]
 *     parameters:
 *       - name: category
 *         in: query
 *         required: false
 *         description: The category of the products to filter by
 *         schema:
 *           type: string
 *       - name: min_price
 *         in: query
 *         required: false
 *         description: Minimum price of the products
 *         schema:
 *           type: number
 *           format: float
 *       - name: max_price
 *         in: query
 *         required: false
 *         description: Maximum price of the products
 *         schema:
 *           type: number
 *           format: float
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination (default is 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: size
 *         in: query
 *         required: false
 *         description: The number of products per page (default is 5)
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: A list of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalPages:
 *                       type: integer
 *                     totalElements:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                             format: float
 *                           description:
 *                             type: string
 *                           imageUrl:
 *                             type: string
 *       500:
 *         description: Có lỗi khi tìm sản phẩm
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

/**
 * @openapi
 * /products/update:
 *   put:
 *     tags:
 *       - Products
 *     summary: Chỉnh sửa thông tin sản phẩm theo ID
 *     description: Update product information by ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the product
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
productRouter.put('/update', checkAuth, checkImageUrl, productsControllers.updateProduct);


/**
 * @openapi
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
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
