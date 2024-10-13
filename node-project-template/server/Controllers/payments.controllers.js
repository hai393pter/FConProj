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
      return res.status(404).json({ data: { statusCode: 404, message: 'Order not found' } });
    }

    const createDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const data = {
      vnp_Version: '2.1.0',
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount * 100,
      vnp_Command: 'pay',
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: req.ip,
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toán cho đơn hàng ${order_id}`,
      vnp_ReturnUrl: 'http://localhost:3000/payment/callback', // Thay đổi URL này theo địa chỉ thực tế
      vnp_TxnRef: order_id.toString(),
    };

    // Create checksum
    const sortedKeys = Object.keys(data).sort();
    const signData = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    const hmac = crypto.createHmac('sha256', hashSecret);
    const signature = hmac.update(signData).digest('hex');
    data.vnp_SecureHash = signature;

    const response = await axios.post(vnpUrl, null, { params: data });
    if (response.data.vnp_ResponseCode === '00') {
      // Lưu thông tin thanh toán vào cơ sở dữ liệu
      const payment = await Payment.create({
        order_id,
        payment_method: 'VNPAY',
        payment_date: new Date(),
        amount,
      });

      return res.status(200).json({ data: { statusCode: 200, message: 'Redirect to payment', url: response.data.vnp_Url } });
    } else {
      return res.status(400).json({ data: { statusCode: 400, message: 'Error processing payment', code: response.data.vnp_ResponseCode } });
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ data: { statusCode: 500, message: 'Server error', error: error.message } });
  }
};

// Handle payment callback
export const paymentCallback = async (req, res) => {
  const { vnp_ResponseCode, vnp_TxnRef } = req.query;

  // Xử lý phản hồi từ VNPAY tại đây
  // Cập nhật trạng thái thanh toán trong cơ sở dữ liệu nếu cần

  res.status(200).json({ data: { statusCode: 200, message: 'Payment callback received', responseCode: vnp_ResponseCode } });
};

export default {
  createPayment,
  paymentCallback,
};
