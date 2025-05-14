const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

//Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepicUrl",
    },
  });

  sendToken(user, 201, res);
});

//Login a User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has passed both

  if (!email && !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

// User Logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "user logged out successfully",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://localhost:4000/api/v1/password/reset/${resetToken}`;
  const message = `your password reset token is :- \n\n ${resetPasswordUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Shadenium Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (error) {
    console.log("Error in Forgot Password =>", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset Password Token has expired", 404));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("The Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });

})
// update User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match!", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);

  res.status(200).json({
    success: true,
    user,
  })
})
// update User Password
exports.updateProfile = catchAsyncError(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // We will add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new: true,
    runValidator: true,
    userFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})
// Get all users(admin) can add pagination, filter and sort if required
exports.getAllUsers = catchAsyncError(async (req,res,next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
})
// Get single user (admin)
exports.getUser = catchAsyncError(async (req,res,next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`No user with id ${req.params.id}` ,404))
  }

  res.status(200).json({
    success: true,
    user
  })
})