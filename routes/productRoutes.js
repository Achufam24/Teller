const express = require('express');
const router = express.Router();
const { getProduct, createProduct } = require('../controllers/productController');
const upload = require("../utils/multer");
const { requireAuth, admin } = require('../middlewares/requireAuth')


router.get('/', getProduct);
router.post('/', requireAuth, upload.single("productImage"), createProduct )



module.exports = router;