const ErrorHandler = require("../utils/ErrorHandler");
const catchAsycError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//Register a User
exports.registerUser = catchAsycError( async(req,res,next) => {
    console.log("req=>", req);
    console.log("req.body=>", req.body);
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            "public_id": "this is a sample id",
            "url": "profilepicUrl"
        }
    });

    sendToken(user,201,res);
});

//Login a User
exports.loginUser = catchAsycError( async(req,res,next) => {
    const { email, password} = req.body;
    //checking if user has passed both

    if(!email && !password){
        return next(new ErrorHandler("Please Enter Email & Password",400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }
    
    const isPasswordMatched = user.comparePassword(password);
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user,200,res);
})
