import express from "express";
import { checkAuth, forgotPassword, login, logout, resetpassword, signup, updateProfile, verifyEmail } from "../controllers/user-controller";
import { isAuthenticated } from "../middlewares/isAuthenticated"; 

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetpassword);
router.route("/profile/update").put(isAuthenticated, updateProfile);

export default router;