import express from 'express';
import { createOrder, getUserOrders, updateOrderStatus } from '../Controllers/order.controllers.js';

const orderRouter = express.Router();

// Route to create a new order
/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Tạo đơn hàng mới 
 *     tags: 
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Đơn hàng đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Mã đơn hàng
 *                 user_id:
 *                   type: integer
 *                   description: Mã người dùng
 *                 status:
 *                   type: string
 *                   enum: [pending, shipped, delivered, cancelled]
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
orderRouter.post('/', createOrder);

// Route to get all orders for a user
/**
 * @openapi
 * /orders/{user_id}:
 *   get:
 *     summary: Lấy tất cả đơn hàng
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mã người dùng
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Mã đơn hàng
 *                   user_id:
 *                     type: integer
 *                     description: Mã người dùng
 *                   status:
 *                     type: string
 *                     enum: [pending, shipped, delivered, cancelled]
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Không tìm thấy đơn hàng của người dùng hiện tại
 *       500:
 *         description: Server error
 */
orderRouter.get('/:user_id', getUserOrders);

// Route to update the status of an order
/**
 * @openapi
 * /orders/{order_id}:
 *   put:
 *     summary: Cập nhật tình trạng đơn hàng
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mã đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Đã cập nhật tình trạng đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Server error
 */
orderRouter.put('/:order_id', updateOrderStatus);

export default orderRouter;
