import Product from '../Models/productModel.js'; // Đảm bảo đường dẫn đúng
import moment from 'moment';

// Tạo sản phẩm mới

export const createProduct = async (req, res) => {
    console.log(req.body);
    const { name, price, description, imageUrl } = req.body; // Lấy thông tin sản phẩm từ body

    try {
        const newProduct = await Product.create({ name, price, description, imageUrl,timeStamp: moment().tz('Asia/Bangkok').toDate() });
        return res.status(201).json({ message: "Product created successfully", productId: newProduct.id });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Lấy thông tin sản phẩm theo ID
export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id); // Sử dụng findByPk hoặc phương thức phù hợp với mô hình của bạn
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// Chỉnh sửa thông tin sản phẩm theo ID
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, imageUrl } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Cập nhật thông tin sản phẩm
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.imageUrl = imageUrl || product.imageUrl;
        product.updatedAt = moment().tz('Asia/Bangkok').toDate(); // Cập nhật thời gian theo giờ Việt Nam
        product.timeStamp = moment().tz('Asia/Bangkok').toDate();
        await product.save();

        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Error updating product", error: error.message });
    }

    
};
// Tất cả các hàm
export default { createProduct, getProduct, updateProduct };



