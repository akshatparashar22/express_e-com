const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req ,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    res.status(err.statusCode).json({
        success: false,
        error: err
    })

    //Handling Wrong MongoDb Id Error - Cast Error
    if (err.name === "CastError"){
    const message = `Resource not Found ${err.path}`;
    err = new ErrorHandler(message, 400);

    res.status(400).json({
        success: false,
        message : err.message
    });
}
}   