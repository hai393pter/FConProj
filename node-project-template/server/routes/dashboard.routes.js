import express from 'express';
import { getDashboardMetrics } from '../Controllers/dashboard.controllers.js';
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

export default dashboardRouter;
