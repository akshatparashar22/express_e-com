module.exports = catchAsyncError => (req,res,next) => {
    Promise.resolve(catchAsyncError(req,res,next))
    .catch(error => {
        console.log("error caught=>", error);
        next(error)
    })
}