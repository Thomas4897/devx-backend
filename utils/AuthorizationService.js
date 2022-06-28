const jwt = require('jsonwebtoken');
const UserModel = require('../routes/users/Model/User');

const checkAuth = async ( req, res, next) => {
    
    try {

        const {session_token: sessionToken} = req.cookies;

        if(!sessionToken){
            return next();
        }

        const { userId, iat } = jwt.verify(sessionToken, process.env.JWT_SECRET_KEY)
        
        const foundUser = await UserModel.findOne({ _id: userId })

        req.user = foundUser;
        return next();

    } catch (error) {
        console.log('error:', error)
        return res.status(401).json({error: "User not found or inccorrect credentials"})
    }

}

const AuthorizationService = { checkAuth };

module.exports = AuthorizationService;

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmI5ZTk4NzA3MDRhOTc1YzgwY2JmNjciLCJpYXQiOjE2NTYzNTQwNjI4NDN9.v37M0-LGxEbkMxYEztro615uqWAz3Oyn0PfqKxnQPmM"