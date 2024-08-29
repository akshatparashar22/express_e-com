const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.isAuthenticatedUser = catchAsyncError( async(req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next();
})

exports.authorizationRoles = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            new ErrorHandler(
                `${req.user.role} is not allowed this resource`,
                403
            );
        }
    }
    next();
}