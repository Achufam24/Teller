const express = require('express');
const { LoginUser, RegisterUser, verifyAccount } = require('../controllers/authController');

const router = express.Router();

router.post('/login', LoginUser );

router.post('/register', RegisterUser);

router.get("/confirm/:confirmationCode", verifyAccount);


module.exports = router;