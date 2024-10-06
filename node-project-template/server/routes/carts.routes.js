import express from 'express';
import {
  createCart,
  getCart,
  updateCart,
  deleteCart,
} from '../Controllers/cart.controllers.js'; // Ensure correct path

const cartRouter = express.Router();

// Route to create a new cart
/**
 * @openapi
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart created successfully"
 *       400:
 *         description: Bad request
 */
cartRouter.post('/carts', createCart);

// Route to get a user's cart by userId
/**
 * @openapi
 * /carts/{userId}:
 *   get:
 *     summary: Lấy giỏ hàng theo userID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Giỏ hàng đã được lấy!
 *       404:
 *         description: Không tìm thấy giỏ hàng của bạn!
 */
cartRouter.get('/carts/:userId', getCart);

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
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Giỏ hàng đã được cập nhật!
 *       404:
 *         description: Không tìm thấy giỏ hàng của bạn!
 */
cartRouter.put('/carts/:cartId', updateCart);

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
cartRouter.delete('/carts/:cartId', deleteCart);

// Export the router
export default cartRouter;
