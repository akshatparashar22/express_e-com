const Product = require("../models/productModels");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsycError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/ApiFeatures");

//create Product --Admin
exports.createProduct = catchAsycError (async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});

//Update Product --Admin
exports.updateProduct = catchAsycError (async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("product not found", 404));  
    } else {
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true,
            product
        })
    }
});

//Delete Product --Admin
exports.deleteProduct = catchAsycError (async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("product not found",404) ); 
    } else {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    }
});

exports.getAllProducts = catchAsycError (async (req,res) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    //For search
    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    const products = await apiFeature.query;
    
    res.status(200).json({
        success: true,
        products
    })
});

exports.getProduct = catchAsycError (async (req,res,next) => {

    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found",404) ); 
    } else {
        res.status(200).json({
            success: true,
            product
        })
    }
});