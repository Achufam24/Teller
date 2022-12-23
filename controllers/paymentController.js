const Payment = require('../models/Payment');

const Paystack = require('paystack')(process.env.PAYSTACK_KEY)

const makePayment = (req,res) => {
    const { email, amount, callbackUrl } = req.body;

    Paystack.transaction.initialize({
        email,
        amount,
        callback_url: callbackUrl
    }).then((response) => {
        const { data } = response;
        const { authorization_url, reference } = data
        res.status(200).send({
            url: authorization_url,
            reference
      })
    }).catch((error) => {
        res.status(400).send({error: error.message})
    });
}

const paymentCallback = async(req,res) => {
    const { reference } = req.query;

    Paystack.transaction.verify(reference, (error, body) => {
        if (error) {
            return res.send({
                status: false,
                message: 'An error occured',
                data: error,
            });
        }

        const pay = Payment.create({
            amount: body.data['amount'],
            reference: body.data['reference'],
            email:body.data.customer['email']
        })

        res.send({
            status: true,
            data:body.data,
        })
    })
}

module.exports = {
    makePayment,
    paymentCallback
}