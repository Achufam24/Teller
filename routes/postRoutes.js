const { application } = require('express');
const express = require('express');
const { getPost } = require('../controllers/postController');
const { requireAuth, admin } = require('../middlewares/requireAuth');
const isAdmin = require('../middlewares/isAdmin')



const router = express.Router();




router.get('/', requireAuth, admin, getPost );

module.exports = router;