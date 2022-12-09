const User = require('../models/user');
const asynchandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail');

//create jwt Token
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: process.env.EXPIRE })
}

const createuser = asynchandler(async(req,res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.signup(name, email, password);

    //create a token after registration
    const token = createToken(user._id);

    res.status(200).json({
        name,
        email, 
        token,
        success: 'New user created sucessfully'
    });
    
    } catch (error) {
        res.status(400).json({error:error.message})
    }
});


const updateToAdmin = asynchandler(async(req,res) => {
    const user = await User.findById(req.params.id);

    try {
         if (user) {
        user.name = req.body.name || user.name
        user.role = req.body.role;

        var updatedUser = await user.save();


        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        }); 
        if (user.role === 'admin') {
             // create message to pass
	const text = `<h1>Hello, Our new admin</h1>
    <h2>Hello ${user.name}</h2>
    <p>You are receiving this email because you have 
     been appointed an admin at Teller. A copy of our admin rules will be sent to You shortly.</p>
       <h2><i>Congratulations, Tellerite</i></h2>
    </div>`;

        await sendEmail({
            email: user.email,
            subject: 'Admin Appointment',
            message: text,
        });
        }
    }
     else{
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
});


const deleteUser = asynchandler(async(req,res) => {
    const user = await User.findById(req.params.id);
    try {
        if (user) {
            await user.remove();
            res.json({message: 'User removed'})
        }else{
            res.status(404);
            throw new Error('User not found')
        }
    } catch (error) {
        
    }
});

//get all users except me
const getUsersExceptMe = asynchandler(async (req,res) => {
    try {
        const users = await User.find({_id: {$ne:req.user._id}});
        if (!users) {
          res.status(404);
          throw new Error(`No Users found`);
        }
    
        res.status(200).json({
            sucess:'pass',
            users
        });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

//get ALL Users including Me

const getAllusers = asynchandler(async(req,res) => {
    try {
        const users = await User.find();
        if (!users) {
          res.status(404);
          throw new Error(`No Users found`);
        }
    
        res.status(200).json({
            sucess:'pass',
            users
        });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

module.exports = {
    createuser,
    updateToAdmin,
    deleteUser,
    getUsersExceptMe,
    getAllusers
}