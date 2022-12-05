const express = require('express');
const { LoginUser, RegisterUser } = require('../controllers/authController');

const router = express.Router();

router.post('/login', LoginUser );

router.post('/register', RegisterUser);

router.post('/admin', );


module.exports = router;