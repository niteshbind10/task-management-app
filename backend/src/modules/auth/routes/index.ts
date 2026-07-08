import express from "express";
import { register, login, logout, getMe } from "../controller";
import { registerSchema, loginSchema } from "../validations";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

export default router;
