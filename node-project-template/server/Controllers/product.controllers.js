// controllers/products.controller.js

import Product from ('../Models/productModel');


// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết sản phẩm', error });
    }
};

// Thêm sản phẩm mới
exports.addProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;

        const newProduct = new Product({
            name,
            price,
            description
        });

        await newProduct.save();
        res.status(201).json({ message: 'Thêm sản phẩm thành công', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
};
