const User = require("../models/user");
const asynchandler = require('express-async-handler');
const cloudinary = require("../utils/cloudinary");


const getProfile = asynchandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if (user) {
       return res.status(200).json({
        sucess: true,
        user,
       });
    }
});

const updateProfile = asynchandler(async(req,res) => {
    const { name } = req.body;

    try {
        const user = await User.findById(req.user._id);
        

        //check if user exists
        if (user && !req.file) {
            user.name = name;

            const updatedUser = await user.save();

            res.status(200).json({
                sucess:true,
                message: 'Profile Updated sucessfully',
                user: updatedUser,
            });
        }

        // if user exist and image is uploaded
    else if (user.name && user.profilePictureUrl) {
        const result = await cloudinary.cloudinary.uploader.upload(req.file.path)
        user.name = req.body.name;
        user.profilePictureUrl = result.secure_url;
        user.cloudinary_id = result.public_id

  
        // save updated user
        const updatedUser = await user.save();
  
        res.status(200).json({
          success: true,
          message: 'Profile Updated Successfully',
          user: updatedUser,
        });
      } 
    //   else {
    //     res.status(404);
    //     throw new Error('User not found');
    //   }        
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});




module.exports = {
    getProfile,
    updateProfile
}