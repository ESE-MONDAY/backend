import express from "express";
import { register, login, logout,refreshToken  } from "../controller/authController.js";
import { refreshTokenMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register",register);
router.post("/login", login);
router.post("/refresh-token", refreshTokenMiddleware, refreshToken);
router.post("/logout", logout);




export default router;