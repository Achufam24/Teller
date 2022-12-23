const mongoose = require('mongoose');
const User = require('../models/user')

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    price:{
        reuired: true,
        type: String
    },
    productImage:{
        type:String,
        required: true
    },
    description: {
        type:String,
    },
    category: {
        type: String
    },
    cloudinary_id: {
        type: String
    },
    author:{
        type: String,
        required: true
    },
    user_id: {
        type:String,
        required: true
    },

}, {timestamps:true})

const Product = mongoose.model('Product', productSchema);

module.exports = Product