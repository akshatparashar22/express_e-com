const express = require("express");
const { getAllProducts, createProduct,updateProduct, deleteProduct, getProduct } = require("../controllers/productController");
const { isAuthenticatedUser, authorizationRoles } = require("../middleware/auth");

const router = express.Router();

router
    .route("/products")
    .get(getAllProducts);

router
    .route("/product/new")
    .post(isAuthenticatedUser, authorizationRoles("admin") , createProduct);

router
    .route("/product/:id")
    .put(isAuthenticatedUser, authorizationRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizationRoles("admin"), deleteProduct)
    .get(getProduct);

module.exports = router;