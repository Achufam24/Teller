const express = require('express');
const { LoginUser, RegisterUser } = require('../controllers/authController');

const router = express.Router();

router.post('/login', LoginUser );

router.post('/register', RegisterUser);

router.get("/confirm/:confirmCode")


module.exports = router;