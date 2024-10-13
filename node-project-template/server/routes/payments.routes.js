import express from 'express';
import { createPayment, paymentCallback } from '../Controllers/payments.controllers.js';

const router = express.Router();

/**
 * @openapi
 * /payment:
 *   post:
 *     summary: Tạo thanh toán mới qua VNPAY.
 *     description: Tạo giao dịch thanh toán cho đơn hàng thông qua cổng thanh toán VNPAY.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - amount
 *             properties:
 *               order_id:
 *                 type: integer
 *                 example: 123
 *                 description: ID của đơn hàng.
 *               amount:
 *                 type: number
 *                 example: 500000
 *                 description: Số tiền cần thanh toán (VND).
 *     responses:
 *       200:
 *         description: Trả về URL để chuyển hướng tới VNPAY.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Redirect to payment
 *                 url:
 *                   type: string
 *                   example: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?params=...
 *       400:
 *         description: Lỗi xử lý thanh toán.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error processing payment
 *                 code:
 *                   type: string
 *                   example: 99
 *       500:
 *         description: Lỗi server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Error details
 */
router.post('/', createPayment);

/**
 * @openapi
 * /payment/callback:
 *   get:
 *     summary: Callback từ VNPAY sau khi thanh toán hoàn tất.
 *     description: Xử lý phản hồi từ VNPAY và cập nhật trạng thái thanh toán.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *           example: 00
 *         required: true
 *         description: Mã phản hồi từ VNPAY.
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *           example: 123
 *         required: true
 *         description: ID giao dịch của đơn hàng.
 *     responses:
 *       200:
 *         description: Phản hồi callback thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment callback received
 *                 responseCode:
 *                   type: string
 *                   example: 00
 *       500:
 *         description: Lỗi server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/callback', paymentCallback);

export default router;
