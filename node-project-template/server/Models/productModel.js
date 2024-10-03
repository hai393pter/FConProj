// models/product.model.js

//import mongoose from 'mongoose';
//const { Schema } = mongoose;
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);

