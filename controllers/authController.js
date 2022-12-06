const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


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

//verify user email
const verifyAccount = async(req,res) => {
    try {
        const { confirmationCode } = req.params;

        //compare the confirmation code
        const confirmUser = await User.findOne({confirmationCode});

        if (!confirmUser) {
           res.status(400);
           throw new Error("User not found"); 
        }else {
            confirmUser.isEmailVerified = true;
            await confirmUser.save();
            res.status(200).json({
                msg: "Verification Successful. You can login now",
                status: confirmUser.isEmailVerified,
              });
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}



module.exports = {
    LoginUser, 
    RegisterUser,
    verifyAccount
}