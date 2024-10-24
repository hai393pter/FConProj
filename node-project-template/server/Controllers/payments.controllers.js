import Payment from '../Models/paymentsModel.js';
import Order from '../Models/orderModel.js';
import crypto from 'crypto';
import PayOS from '@payos/node';

const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const tmnCode = '0ZD5DIPY';
const hashSecret = 'VEKBXCS2Z96K8AC1810AZCMBLICFPPFD';

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);


// Create a payment
export const createPayment = async (req, res) => {
  const { order_id, amount } = req.body;

  try {
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ statusCode: 404, data: { message: 'Order not found' } });
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
      vnp_ReturnUrl: encodeURIComponent(`${req.protocol}://${req.get('host')}/payments/callback`),
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
    return res.status(200).json({ statusCode: 200, data: { message: 'Redirect to payment', url: paymentUrl } });

  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ statusCode: 500, data: { message: 'Server error', error: error.message } });
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
      return res.status(400).json({ statusCode: 400, data: { message: 'Invalid signature' } });
    }

    if (vnp_ResponseCode === '00') {
      await Payment.update(
        {
          paymentStatus: 'COMPLETED',
          transactionId: vnp_TransactionNo,
        },
        { where: { order_id: vnp_TxnRef } }
      );

      return res.status(200).json({ statusCode: 200, data: { message: 'Payment successful', transactionId: vnp_TransactionNo } });
    } else {
      return res.status(400).json({ statusCode: 400, data: { message: 'Payment failed', code: vnp_ResponseCode } });
    }
  } catch (error) {
    console.error('Error in payment callback:', error);
    return res.status(500).json({ statusCode: 500, data: { message: 'Server error', error: error.message } });
  }
};

export const createPayOSPaymentLink = async (req, res) => {
  const { order_id, callbackUrl } = req.body;
  try {
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ statusCode: 404, data: { message: 'Order not found' } });
    }
    const body = {
      orderCode: order_id,
      amount: Number(order.total_price),
      description: "Thanh toan don hang",
      cancelUrl: `${req.protocol}://${req.get('host')}/payments/payOs/failed`,
      returnUrl: `${req.protocol}://${req.get('host')}/payments/payOs/success`
    };
    console.log(body);
    const paymentLinkRes = await payOS.createPaymentLink(body);
    await order.update({
      callback: callbackUrl
    })
    return res.status(200).json({ statusCode: 200, data: { message: 'Redirect to payment', url: paymentLinkRes.checkoutUrl } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ statusCode: 500, data: { message: 'Order Match On PayOs System' } });
  }
}

export const payOsPaymentCallbackSuccess = async (req, res) => {
  const { orderCode } = req.query;

  try {
    if (!orderCode) {
      console.error('No orderCode provided in the request.');
      return res.status(400).send('Bad Request: orderCode is required');
    }
    const order = await Order.findByPk(orderCode);

    if (order) {
      console.log(`Current status of order ${order.id}: ${order.status}`);
      const result = await order.update({ status: 'delivered' });
      console.log(`Order ${order.id} updated to status: ${result.status}`);

      const callback = `${order.callback}`;
      return res.redirect(callback);
    } else {
      console.warn(`Order not found for orderCode: ${orderCode}`);
      const callback = `${order.callback}`;
      return res.redirect(callback);
    }
  } catch (err) {
    console.error('Error processing payment callback:', err);
    return res.status(500).send('Internal Server Error');
  }
}

export const payOsPaymentCallbackFailed = async (req, res) => {
  const { orderCode } = req.query;
  if (!orderCode) {
    console.error('No orderCode provided in the request.');
    return res.status(400).send('Bad Request: orderCode is required');
  }
  try {
    const order = await Order.findByPk(orderCode);
    if (order) {
      console.log(`Updating order ${order.id} to status: cancelled`);
      await order.update({ status: 'cancelled' });
      console.log(`Order ${order.id} updated successfully.`);
    } else {
      console.warn(`Order not found for orderCode: ${orderCode}`);
    }
    const callback = `${order?.callback}`;
    return res.redirect(callback);
  } catch (err) {
    console.error('Error processing payment callback:', err);
    return res.status(500).send('Internal Server Error');
  }
};

export default {
  createPayment,
  paymentCallback,
  createPayOSPaymentLink,
  payOsPaymentCallbackSuccess
};
