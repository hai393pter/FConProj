import express from 'express';
import { createPayment, paymentCallback } from '../Controllers/payments.controllers.js';

const router = express.Router();

/**
 * @openapi
 * /payments:
 *   post:
 *     summary: Create a new payment via VNPAY.
 *     description: Initiate a payment transaction for an order using VNPAY.
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
 *                 description: The ID of the order.
 *               amount:
 *                 type: number
 *                 example: 500000
 *                 description: The amount to be paid (in VND).
 *     responses:
 *       200:
 *         description: Returns a URL to redirect to VNPAY.
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
 *         description: Error processing the payment.
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
 *         description: Server error.
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
 * /payments/callback:
 *   get:
 *     summary: VNPAY callback after payment completion.
 *     description: Handles the VNPAY response and updates the payment status.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *           example: 00
 *         required: true
 *         description: The response code from VNPAY.
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *           example: 123
 *         required: true
 *         description: The transaction reference ID.
 *       - in: query
 *         name: vnp_TransactionNo
 *         schema:
 *           type: string
 *           example: 456789
 *         required: true
 *         description: The transaction ID from VNPAY.
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *           example: d41d8cd98f00b204e9800998ecf8427e
 *         required: true
 *         description: The secure hash to validate the callback data.
 *     responses:
 *       200:
 *         description: Payment callback successfully processed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment successful
 *                 transactionId:
 *                   type: string
 *                   example: 456789
 *       400:
 *         description: Payment failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment failed
 *                 code:
 *                   type: string
 *                   example: 99
 *       500:
 *         description: Server error.
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
