import Payment from '../Models/paymentsModel.js';
import Order from '../Models/orderModel.js';
import axios from 'axios';
import crypto from 'crypto';

const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const tmnCode = '0ZD5DIPY';
const hashSecret = 'VEKBXCS2Z96K8AC1810AZCMBLICFPPFD';

// Create a payment
export const createPayment = async (req, res) => {
  const { order_id, amount } = req.body;

  try {
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ statusCode: 404, data: {  message: 'Order not found' } });
    }

    // Đảm bảo định dạng vnp_CreateDate đúng chuẩn yyyyMMddHHmmss
    const createDate = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');

    const data = {
      vnp_Version: '2.1.0',
      vnp_TmnCode: tmnCode,
      vnp_Amount: Math.round(amount * 100), // Nhân với 100 để chuyển thành đơn vị nhỏ nhất của VND
      vnp_Command: 'pay',
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: req.ip,
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toán cho đơn hàng ${order_id}`,
      vnp_ReturnUrl: encodeURIComponent(`${req.protocol}://${req.get('host')}/payments/callback`), // Đảm bảo URL callback chính xác
      vnp_TxnRef: order_id.toString(),
    };

    // Tạo checksum
    const sortedKeys = Object.keys(data).sort();
    const signData = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    const hmac = crypto.createHmac('sha256', hashSecret);
    const signature = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    data.vnp_SecureHash = signature;

    // Chuyển đổi data thành query string
    const queryParams = new URLSearchParams(data).toString();
    const paymentUrl = `${vnpUrl}?${queryParams}`;

    // Redirect user to VNPAY payment page
    return res.status(200).json({ statusCode: 200, data: {  message: 'Redirect to payment', url: paymentUrl } });

  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ statusCode: 500, data: {  message: 'Server error', error: error.message } });
  }
};


// Handle payment callback
export const paymentCallback = async (req, res) => {
  const { vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo, vnp_SecureHash } = req.query;

  try {
    // Verify checksum
    const queryData = req.query;
    delete queryData.vnp_SecureHash;

    const sortedKeys = Object.keys(queryData).sort();
    const signData = sortedKeys.map(key => `${key}=${queryData[key]}`).join('&');
    const hmac = crypto.createHmac('sha256', hashSecret);
    const checkSignature = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (checkSignature !== vnp_SecureHash) {
      return res.status(400).json({ statusCode: 400, data: {  message: 'Invalid signature' } });
    }

    // Check VNPAY response code
    if (vnp_ResponseCode === '00') {
      // Update payment status in the database
      await Payment.update(
        {
          paymentStatus: 'COMPLETED',
          transactionId: vnp_TransactionNo,
        },
        { where: { order_id: vnp_TxnRef } }
      );

      return res.status(200).json({ statusCode: 200, data: {  message: 'Payment successful', transactionId: vnp_TransactionNo } });
    } else {
      return res.status(400).json({ statusCode: 400, data: {  message: 'Payment failed', code: vnp_ResponseCode } });
    }
  } catch (error) {
    console.error('Error in payment callback:', error);
    return res.status(500).json({ statusCode: 500, data: {  message: 'Server error', error: error.message } });
  }
};

export default {
  createPayment,
  paymentCallback,
};
