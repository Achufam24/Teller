const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscribeSchema = new Schema({
    email: {
        type: String,
        required:true
    },
    subscribed: {
        type:Boolean,
        default: false
    }
},{timestamps:true});

const Subscribe = mongoose.model('Subscribe', subscribeSchema);

module.exports = Subscribe;
