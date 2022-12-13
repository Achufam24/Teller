const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../utils/sendEmail');
const crypto = require('crypto');
const asynchandler = require('express-async-handler');



//create jwt Token
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: process.env.EXPIRE })
}

/**
 * @desc Register a user
 * @route POST
 * @route /v1/auth/register
 * @access Public
 */

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

/**
 * @desc Login user
 * @route GET
 * @route v1/user/login
 * @access Public 
 */

const  LoginUser = async(req,res) => {
    const {email, password} = req.body
    try {
        const user = await User.login(email,password);

        //check if user is verified
        if (user.isEmailVerified === false) {
			res.status(401);
			throw new Error(
				'Your Account is not Verified. Please Verifiy Your Account'
			);
		}

        //create a token after login
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
};

/**
 * @desc Verify User account
 * @route POST
 * @route v1/auth/register
 * @access Public 
 */

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

/**
 * @desc Update a new password
 * @route PUT
 * @route v1/user/forgotpassword
 * @access Public
 */


const forgotPassword = asynchandler( async(req,res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('There is no user with this email')
    }

    //Get reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // create message to pass
	const text = `<h1>Password Reset Link</h1>
    <h2>Hello ${user.name}</h2>
    <p>You are receiving this email because you (or someone else) has
     requested the reset of a password</p>
       <a href='https://teller-u11u.onrender.com/v1/auth/resetpassword/${resetToken}'> Click here to reset your password</a>
    </div>`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message: text,
        });
        res.status(200).json({
            sucess: true,
            data: 'Email sent'
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		res.status(500);
		throw new Error('Email could not be sent');
    }
});

/**
 * @desc Reset User password
 * @route PUT
 * @route /v1/user/resetpassword/:resettoken
 * @access Public
 */

const resetPassword = asynchandler(async(req,res) => {
    //get hashed token
    const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex');

    

    const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

    if (!user) {
        res.status(400);
        throw new Error('Invalid token')
    }

    //set password
    // ?set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
		msg: 'Password Reset Successfully. Please Login with your new password',
	});

});



module.exports = {
    LoginUser, 
    RegisterUser,
    verifyAccount,
    forgotPassword,
    resetPassword
}