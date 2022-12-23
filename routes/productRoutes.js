const express = require('express');
const router = express.Router();
const { getProduct, getUserProduct, createProduct, getSingleProduct,deleteProduct  } = require('../controllers/productController');
const upload = require("../utils/multer");
const { requireAuth, admin } = require('../middlewares/requireAuth')


router.get('/', getProduct);
router.post('/', requireAuth, upload.single("productImage"), createProduct );
router.get('/:id',getSingleProduct);
router.delete('/:id', requireAuth, deleteProduct);

router.get('/user/userproduct', requireAuth, getUserProduct)



module.exports = router;