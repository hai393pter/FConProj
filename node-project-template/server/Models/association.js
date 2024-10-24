import Order from './orderModel.js';
import Cart from './cartModel.js';
import User from './userModel.js';
import Product from './productModel.js';

// Define associations here
const setupAssociations = () => {
  Order.belongsTo(User, { foreignKey: 'user_id' }); // Association between Order and User
  Order.hasMany(Cart, { foreignKey: 'order_id' }); // Association between Order and Cart
  Cart.belongsTo(Order, { foreignKey: 'order_id' }); // Reverse association from Cart to Order

  Cart.belongsTo(Product, { foreignKey: 'product_id' }); // Association between Cart and Product
  Product.hasMany(Cart, { foreignKey: 'product_id' }); // Reverse association from Product to Cart
};

export default setupAssociations;
