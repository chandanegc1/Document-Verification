import { Router } from "express";
import { CDregister, HRregister, CDlogin, logout, HRlogin } from "../controllers/authController.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../Middleware/ValidationMiddleware.js";

const router = Router();

router.post("/register/:id", CDregister);
router.post("/register-hr", HRregister);
router.post("/login", CDlogin);
router.post("/login-hr", HRlogin);
router.get("/logout", logout);

export default router;
