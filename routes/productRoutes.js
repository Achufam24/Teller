const express = require('express');
const router = express.Router();
const { getProduct, createProduct, getSingleProduct } = require('../controllers/productController');
const upload = require("../utils/multer");
const { requireAuth, admin } = require('../middlewares/requireAuth')


router.get('/', getProduct);
router.post('/', requireAuth, upload.single("productImage"), createProduct );
router.get('/:id',getSingleProduct);



module.exports = router;