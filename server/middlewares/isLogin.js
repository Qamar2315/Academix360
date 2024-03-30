const jwt = require('jsonwebtoken')
const User = require('../model/user')
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

const isLogin = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, "SECURITY_INFORMATION_FOR_SESSION");
            if (decoded._id && decoded.name && decoded.email) {
                const user = await User.findById(decoded._id);
                if (!user) {
                    throw new AppError("NOT AUTHORIZED, TOKEN FAILED!", 201);
                }
                req.user = decoded;
                console.log(req.user);
                next();
            }else{
                throw new AppError("NOT AUTHORIZED, TOKEN FAILED!", 201);
            }
        } catch (error) {
            throw new AppError("NOT AUTHORIZED, TOKEN FAILED!", 201);
        }
    }
    if (!token) {
        throw new AppError("NOT AUTHORIZED, NO TOKEN");
    }
})

module.exports = {
    isLogin
};