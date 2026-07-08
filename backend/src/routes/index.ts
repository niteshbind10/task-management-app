import express from "express";
import authRoutes from "@/modules/auth/routes";
import taskRoutes from "@/modules/tasks/routes";
import dashboardRoutes from "@/modules/dashboard/routes";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/tasks", taskRoutes);
router.use("/api/dashboard", dashboardRoutes);

export default router;
