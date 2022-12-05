const mongoose = require('mongoose');

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log(`MONGODB Connected`);
    } catch (error) {
        console.log(error);
    }
};