const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    console.log("here in errorjs");
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Handling Wrong MongoDb Id Error - Cast Error
  if (err.name === "CastError") {
    const message = `Resource not Found ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //mongoose duplicate key error
  if (err.code === 11000) {
    console.log("duplicate error happened!!");
    const message = `${Object.keys(
      err.keyValue
    )} already exists, Please enter a different ${Object.keys(err.keyValue)}`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  //JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });

};
