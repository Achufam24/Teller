const express = require('express');
const cloudinary = require('../utils/cloudinary');
const upload = require("../utils/multer");
const { getProfile, updateProfile } = require('../controllers/userController');
const { requireAuth } = require('../middlewares/requireAuth')

const router = express.Router();


router.get('/',requireAuth, getProfile );

router.patch('/',requireAuth, upload.single("profilephoto"), updateProfile );



module.exports = router;