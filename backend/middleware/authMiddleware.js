import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    //Get the token from cookie that was stored in 
    const token = req.cookies.jwt

    //Check if the token is valid
    if (token) {
        try {
            //Cross check that the token is valid with the security key
            const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY)
            //If the token is valid push the user token data into request object
            req.user = await User.findById(decoded.userId).select('-password')
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export {
    protect
};