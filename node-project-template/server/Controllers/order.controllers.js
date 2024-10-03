const express = require('express');
const Order = require('../../../Models/orderModel');


// Tạo đơn hàng mới
exports.createOrder = (req, res) => {
    const { userId } = req.params;
    const { products } = req.body;

    Order.createOrder(userId, products, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating order' });
        res.status(201).json({ message: 'Order created successfully' });
    });
};
