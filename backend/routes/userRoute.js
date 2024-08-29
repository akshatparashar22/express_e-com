const express = require("express");
const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getUser
} = require("../controllers/userController");

const router = express.Router();
const { isAuthenticatedUser, authorizationRoles } = require("../middleware/auth");


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout); // can make this post
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizationRoles("admin",getAllUsers));
router.route("/admin/user").get(isAuthenticatedUser,authorizationRoles("admin",getUser));

module.exports = router;