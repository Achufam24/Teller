const express = require('express');

const router = express.Router();
const { subscribe, unsubscribe, unSubscribeEmail } = require('../controllers/subscribeController')


router.post('/subscribe', subscribe);

router.post('/unsubscribe',unsubscribe);

router.get('/unsubscribe/:email',unSubscribeEmail );

module.exports = router;