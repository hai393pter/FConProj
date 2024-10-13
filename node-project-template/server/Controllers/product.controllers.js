import Product from '../Models/productModel.js'; // Đảm bảo đường dẫn đúng
import moment from 'moment';
import { Op } from 'sequelize';

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
    console.log(req.body);
    const { name, category, price, description, imageUrl } = req.body; // Lấy thông tin sản phẩm từ body

    try {
        const newProduct = await Product.create({ 
            name, 
            category, 
            price, 
            description, 
            imageUrl, 
            timeStamp: moment().tz('Asia/Bangkok').toDate() 
        });
        return res.status(200).json({ 
            statusCode: 200, 
            message: "Product created successfully", 
            productId: newProduct.id 
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ 
            statusCode: 500, 
            message: "Error creating product", 
            error: error.message 
        });
    }
};

// Get all products based on category, min(max) price
export const getAllProducts = async (req, res) => {
    try {
        const { category, min_price, max_price } = req.query;

        // Build the filter criteria
        let filter = {};
        if (category) {
            filter.category = category; // Filter by category
        }
        if (min_price || max_price) {
            filter.price = {};
            if (min_price) {
                filter.price[Op.gte] = parseFloat(min_price); // Greater than or equal to min_price
            }
            if (max_price) {
                filter.price[Op.lte] = parseFloat(max_price); // Less than or equal to max_price
            }
        }

        // Fetch all products or filtered products from the database
        const data = await Product.findAll({ where: filter });
        return res.status(200).json({ 
            statusCode: 200, 
            data 
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ 
            statusCode: 500, 
            message: "Error fetching products", 
            error: error.message 
        });
    }
};

// Lấy thông tin sản phẩm theo ID
export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Product.findByPk(id); // Sử dụng findByPk hoặc phương thức phù hợp với mô hình của bạn
        console.log(data);
        if (!data) {
            return res.status(404).json({ 
                statusCode: 404, 
                message: "Product not found" 
            });
        }
        
        return res.status(200).json({ 
            statusCode: 200, 
            data
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ 
            statusCode: 500, 
            message: "Error fetching product", 
            error: error.message 
        });
    }
};

// Chỉnh sửa thông tin sản phẩm theo ID
export const updateProduct = async (req, res) => {
    const { id } = req.body; // Thay đổi: Lấy ID từ body
    const { name, category, price, description, imageUrl } = req.body;

    try {
        const data = await Product.findByPk(id);
        if (!data) {
            return res.status(404).json({ 
                statusCode: 404, 
                message: "Product not found" 
            });
        }
        // Cập nhật thông tin sản phẩm
        data.name = name || data.name;
        data.category = category || data.category;
        data.price = price || data.price;
        data.description = description || data.description;
        data.imageUrl = imageUrl || data.imageUrl;
        data.updatedAt = moment().tz('Asia/Bangkok').toDate(); // Cập nhật thời gian theo giờ Việt Nam
        data.timeStamp = moment().tz('Asia/Bangkok').toDate();
        await data.save();

        return res.status(200).json({ 
            statusCode: 200, 
            message: "Product updated successfully", 
            data
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ 
            statusCode: 500, 
            message: "Error updating product", 
            error: error.message 
        });
    }
};

// Filter products based on query parameters
export const filterProducts = async (req, res) => {
    try {
        const { category, min_price, max_price, page = 1, limit = 5 } = req.query;

        // Chuyển đổi page và limit sang số nguyên
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;

        // Tạo filter cho category và price
        let filter = {};
        if (category) {
            filter.category = category;
        }

        if (min_price || max_price) {
            filter.price = {};
            if (min_price && !isNaN(parseFloat(min_price))) {
                filter.price[Op.gte] = parseFloat(min_price); // Lớn hơn hoặc bằng min_price
            }
            if (max_price && !isNaN(parseFloat(max_price))) {
                filter.price[Op.lte] = parseFloat(max_price); // Nhỏ hơn hoặc bằng max_price
            }
        }

        // Tính toán offset cho pagination
        const offset = (pageNumber - 1) * limitNumber;

        // Lấy danh sách sản phẩm đã filter với phân trang
        const data = await Product.findAll({
            where: filter,
            limit: limitNumber,
            offset: offset
        });

        // Lấy tổng số lượng sản phẩm đã filter
        const totalElements = await Product.count({ where: filter });

        // Tính số trang
        const totalPages = Math.ceil(totalElements / limitNumber);

        return res.status(200).json({
            statusCode: 200,
            message: "Lọc sản phẩm thành công",
            data: {
                totalPages,
                totalElements,
                size: limitNumber, // Số lượng sản phẩm trong mỗi trang
                currentPage: pageNumber,
                products: data
            }
        });
    } catch (error) {
        console.error('Error filtering products:', error);
        return res.status(500).json({ 
            statusCode: 500, 
            message: 'Lỗi server', 
            error: error.message 
        });
    }
};


// Tất cả các hàm
export default { createProduct, getProduct, updateProduct, filterProducts, getAllProducts };
