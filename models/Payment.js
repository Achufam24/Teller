const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    amount: Number,
    reference: String,
    email:String,
    payer: {
        type:String
        
    }
})


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment