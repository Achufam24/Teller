const express = require('express');
const { getPost } = require('../controllers/postController');
const { requireAuth, admin } = require('../middlewares/requireAuth');



const router = express.Router();




router.get('/', requireAuth, admin, getPost );

module.exports = router;