import { Router } from "express";
import { loginHR, sendOtp, registerCandidate, registerHR, loginCandidate, logoutUser, verifyOtp } from "../controllers/authController.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../Middleware/ValidationMiddleware.js";

const router = Router();

router.get("/otp-send/:email", sendOtp);
router.post("/otp-verification", verifyOtp);
router.post("/register/:id", registerCandidate);
router.post("/register-hr", registerHR);
router.post("/login", loginCandidate);
router.post("/login-hr", loginHR);
router.get("/logout", logoutUser);

export default router;
