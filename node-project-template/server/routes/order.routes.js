import express from 'express';
import { createOrder, getUserOrders, updateOrderStatus } from '../Controllers/order.controllers.js';

const orderRouter = express.Router();

// Route to create a new order
/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create a new order
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
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
orderRouter.post('/', createOrder);

// Route to get all orders for a user
/**
 * @openapi
 * /orders/{user_id}:
 *   get:
 *     summary: Get all orders for a specific user
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: No orders found for user
 *       500:
 *         description: Server error
 */
orderRouter.get('/:user_id', getUserOrders);

// Route to update the status of an order
/**
 * @openapi
 * /orders/{order_id}:
 *   put:
 *     summary: Update the status of an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order
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
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRouter.put('/:order_id', updateOrderStatus);

export default orderRouter;
