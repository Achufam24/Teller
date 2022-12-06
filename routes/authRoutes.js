const express = require('express');
const { LoginUser, RegisterUser, verifyAccount, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/login', LoginUser );

router.post('/register', RegisterUser);

router.get("/confirm/:confirmationCode", verifyAccount);

router.post("/resetpassword/:resettoken", resetPassword)

router.post("/forgotpassword",forgotPassword)


module.exports = router;