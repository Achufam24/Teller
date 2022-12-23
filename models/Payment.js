const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    amount: Number,
    reference: String,
    email:String
})


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment