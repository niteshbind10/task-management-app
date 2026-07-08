import express from "express";
import { getDashboardStats } from "../controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getDashboardStats);

export default router;
