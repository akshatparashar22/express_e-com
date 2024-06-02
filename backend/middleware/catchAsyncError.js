module.exports = catchAsycError => (req,res,next) => {
    Promise.resolve(catchAsycError(req,res,next))
    .catch(next)
}