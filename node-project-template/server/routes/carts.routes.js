import express from 'express';
import {
  createCart,
  getCart,
  updateCart,
  deleteCart,
  addProductToCart,
} from '../Controllers/cart.controllers.js'; // Ensure correct path

const cartRouter = express.Router();

// Route to create a new cart
/**
 * @openapi
 * /carts:
 *   post:
 *     summary: Tạo giỏ hàng mới
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: interger
 *                 example: 1
 *     responses:
 *       201:
 *         description: Giỏ hàng đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Giỏ hàng đã được tạo"
 *       404:
 *         description: Không thể tìm thấy người dùng
 */

cartRouter.post('/', createCart);

// Route to get a user's cart by userId
/**
 * @openapi
 * /carts/{user_id}:
 *   get:
 *     summary: Lấy giỏ hàng theo mã người dùng
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Giỏ hàng đã được lấy!
 *       404:
 *         description: Không tìm thấy giỏ hàng của bạn!
 */
cartRouter.get('/:user_id', getCart);

// Add product to cart
/**
 * @openapi
 * /carts/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng.
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Sản phẩm đã được thêm vào giỏi hàng!
 *       404:
 *         description: Không thể tìm thấy sản phẩm.
 */
cartRouter.post('/add', addProductToCart);


// Route to update a cart by cartId
/**
 * @openapi
 * /carts/{cartId}:
 *   put:
 *     summary: Cập nhật giỏ hàng
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Giỏ hàng đã được cập nhật!
 *       404:
 *         description: Không tìm thấy giỏ hàng của bạn!
 */
cartRouter.put('/:cartId', updateCart);

// Route to delete a cart by cartId
/**
 * @openapi
 * /carts/{cartId}:
 *   delete:
 *     summary: Xóa giỏ hàng
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Giỏ hàng đã được xóa!
 *       404:
 *         description: Không tìm thấy giỏ hàng của bạn!
 */
cartRouter.delete('/:cartId', deleteCart);

// Export the router
export default cartRouter;
