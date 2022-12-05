


// const isAdmin = async(req,res,next) => {
//     if (req.user.role === 'user' ) {
//         res.status(401).json({error: 'Resource can obly be accessed by Admins'})
//     }
// }



const isAdmin = (req,res,next) => {
    if (req.user._id === 1) {
        next();
    }
    else{
        team = req.user._id
        console.log(team);
        res.status(201).json({error: "Authorized for admins only"})
    }
}

module.exports = isAdmin;