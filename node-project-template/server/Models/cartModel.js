// models/cart.model.js

import mongoose from 'mongoose';
const { Schema } = mongoose;


const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);
