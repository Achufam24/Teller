const express = require('express');

const router = express.Router();
const {  makePayment, paymentCallback } = require('../controllers/paymentController')


router.post('/api/pay',makePayment);

router.get('/pay/callback',paymentCallback)


module.exports = router