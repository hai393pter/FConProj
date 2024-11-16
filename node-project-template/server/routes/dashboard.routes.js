import express from 'express';
import { getDashboardMetrics, getOrderDetail } from '../Controllers/dashboard.controllers.js';
import checkAuth from '../middlewares/checkAuth.middleware.js';
import { checkAdmin } from '../middlewares/checkAdmin.middlewares.js';

const dashboardRouter = express.Router();


/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Retrieve dashboard metrics
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Dashboard metrics including total orders, total products, and total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                       example: 100
 *                     totalProducts:
 *                       type: integer
 *                       example: 50
 *                     totalRevenue:
 *                       type: number
 *                       format: float
 *                       example: 150000.50
 *       500:
 *         description: Server error
 */

dashboardRouter.get('/', checkAuth, checkAdmin, getDashboardMetrics);



/**
 * @openapi
 * /dashboard/orders/{order_id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng theo order_id
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
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
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Tên sản phẩm
 *                       imageUrl:
 *                         type: string
 *                         description: URL hình ảnh sản phẩm
 *                       quantity:
 *                         type: integer
 *                         description: Số lượng sản phẩm
 *                       price:
 *                         type: number
 *                         description: Giá sản phẩm
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */
dashboardRouter.get('/orders/:order_id', getOrderDetail);

export default dashboardRouter;
