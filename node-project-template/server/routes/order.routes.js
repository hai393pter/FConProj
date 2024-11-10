import express from 'express';
import { createOrder, getUserOrders, updateOrderStatus, getAllOrders } from '../Controllers/order.controllers.js';
import checkAuth from '../middlewares/checkAuth.middleware.js';
import { checkAdmin } from '../middlewares/checkAdmin.middlewares.js'; 
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
 *                 description: Mã người dùng
 *               user_name:
 *                 type: string
 *                 description: Tên người dùng
 *               user_phone:
 *                 type: string
 *                 description: Số điện thoại người dùng
 *               shipping_address:
 *                 type: string
 *                 description: Địa chỉ giao hàng
 *               note:
 *                 type: string
 *                 description: Ghi chú cho đơn hàng (tuỳ chọn)
 *               payment_method:
 *                 type: string
 *                 enum: [COD, bank_transfer]
 *                 description: Phương thức thanh toán
 *               shipping_fee:
 *                 type: number
 *                 format: float
 *                 description: Phí vận chuyển
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
 *                   enum: [pending, shipping, delivered, cancelled]
 *                 createdAt:
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


/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: email
 *         description: Optional filter to search for orders by user email
 *         required: false
 *         schema:
 *           type: string
 *           example: "example@example.com"
 *     responses:
 *       200:
 *         description: List of all orders with user, product, and status details, optionally filtered by email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Orders retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       user_name:
 *                         type: string
 *                       user_phone:
 *                         type: string
 *                       total_price:
 *                         type: number
 *                         format: float
 *                       status:
 *                         type: string
 *                       order_date:
 *                         type: string
 *                         format: date-time
 *                       shipping_fee:
 *                         type: number
 *                         format: float
 *                       voucher_code:
 *                         type: string
 *                       discount_amount:
 *                         type: number
 *                         format: float
 *                       note:
 *                         type: string
 *                       shipping_address:
 *                         type: string
 *                       payment_method:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       Carts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             quantity:
 *                               type: integer
 *                             Product:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 name:
 *                                   type: string
 *                                 imageUrl:
 *                                   type: string
 *                                 price:
 *                                   type: number
 *                                   format: float
 *       403:
 *         description: Forbidden - Admin access only
 *       404:
 *         description: User not found with the given email (if email filter is applied)
 *       500:
 *         description: Server error
 */
orderRouter.get('/', checkAuth, checkAdmin, getAllOrders);



export default orderRouter;
