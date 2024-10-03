// ordermodel.js
import mongoose from 'mongoose';
const { Schema } = mongoose;


// Định nghĩa schema cho order
const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Liên kết với model User
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Liên kết với model Product (bạn cần tạo file productmodel.js nếu chưa có)
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Pending' // Trạng thái mặc định là "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Tạo model từ schema
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
