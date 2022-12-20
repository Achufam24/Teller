const Product = require('../models/product');
const cloudinary = require('../utils/cloudinary');
const asynchandler = require('express-async-handler');
const { sendEmail } = require('../utils/sendEmail')



const getProduct = async(req,res) => {
    const products = await Product.find({}).sort({})

    res.status(200).json(products)
}


const createProduct = asynchandler(async(req,res) => {
    const result = await cloudinary.cloudinary.uploader.upload(req.file.path);
    const text = `<div>
    <h1>you have successfully created a product.</h1>
    </div>`

    const { title,
        price,
        description,
        category } = req.body;
    try {
        
        const product = await Product.create({
            title,
            price,
            productImage : result.secure_url,
            description,
            category,
            cloudinary_id: result.public_id,
            author:req.user.name
        })
        if (product) {
            const postProduct = await product.save({});
            await sendEmail({
                email: req.user.email,
                subject: 'Product Created',
                message: text,
            })
            res.status(200).json(postProduct)
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});


module.exports = {
    getProduct,
    createProduct
}