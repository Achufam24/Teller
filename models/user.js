const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../utils/sendEmail')


const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
   
    },
    isEmailVerified: { type: Boolean, default: false },
    confirmationCode: { type: String },
})

userSchema.statics.signup = async function (name,email,password,confirmationCode){
    //validation
    if (!name || !email  || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }
    const exists = await this.findOne({email})

    if (exists) {
        throw Error('Email already in use')
    }

    const verifyToken = uuidv4();

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({name,email,password:hash, confirmationCode:verifyToken})

    if (user) {
        const text = `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Verify your email address to complete the signup and login to your account to Teller</p>
          <a href='https://teller-u11u.onrender.com/v1/auth/confirm/${user.confirmationCode}'> Click here</a>
  
          </div>`;
        await sendEmail({
            email: user.email,
            subject: "Email verification",
            message: text,
        });
    }

    return user
}


userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled correctly!');
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect Email')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect password')
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);
