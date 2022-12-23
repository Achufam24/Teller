const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
// const { connectDB } = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bodyParser = require('body-parser');



dotenv.config();

app.use(cors());
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(
//     express.urlencoded({ extended: true })
// );
app.use(express.json());
app.use((req,res,next) =>{
    console.log(req.path,req.method);
    next();
})

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// connectDB();

app.get('/', (req,res) => {
    res.send('Welcome to Teller API service')
})

app.use('/v1/auth', authRoutes);
app.use('/v1/post', postRoutes);
app.use('/v1/user', userRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/sub', subscribeRoutes);
app.use('/v1/product', productRoutes);
app.use('/v1/payment', paymentRoutes)

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    //listens for requests
    app.listen(PORT, () => {
        console.log('connected to db and listening at port',PORT);
    })
}).catch((error) => {
    console.log(error);
})



