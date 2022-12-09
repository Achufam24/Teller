const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers
  
    if (!authorization) {
      return res.status(401).json({error: 'Authorization token required'})
    }
  
    const token = authorization.split(' ')[1]
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET)
  
      req.user = await User.findById(decoded._id).select('-password');
      console.log(req.user)
      next()
  
    } catch (error) {
      console.log(error)
      res.status(401).json({error: 'Request is not authorized'})
    }
  }

  const admin = (req, res, next) => {
    if(req.user.role === 'user') {
        console.log(req.user._id);
        res.status(401)
        .json({error: "denied access, Admin only!"})
    } else{
        next();
    }
}
  
  module.exports = {
    requireAuth, admin
  }