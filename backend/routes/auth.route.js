import express from "express";
import {signup,login,logout,verifyEmail,forgotPassword,restPassword,checkAuth } from "../controllers/auth.controller.js";
const router = express.Router();
import {verifyToken} from "../middleware/verifyToken.js";
router.get("/check-auth",verifyToken,checkAuth)
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token",restPassword);
 export default router;