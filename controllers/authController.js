const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//create jwt Token
const createToken = (_id) => {
    return jwt.sign({_id}, 'Achufam24', { expiresIn: process.env.EXPIRE })
}

const  LoginUser = async(req,res) => {
    const {email, password} = req.body
    try {
        const user = await User.login(email,password)

        //create a token after login
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
};


const RegisterUser = async(req,res) => {
    const {name,email,password} = req.body
    try {
        const user = await User.signup(name, email, password)


        //create a token after registration
        const token = createToken(user._id)

        res.status(200).json({name,email, token})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
};



module.exports = {
    LoginUser, 
    RegisterUser,
}