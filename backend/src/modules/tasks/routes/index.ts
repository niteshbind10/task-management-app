import express from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from "../controller";
import { createTaskSchema, updateTaskSchema, taskIdSchema } from "../validations";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.get("/:id", validate(taskIdSchema, "params"), getTaskById);
router.put("/:id", validate(taskIdSchema, "params"), validate(updateTaskSchema), updateTask);
router.delete("/:id", validate(taskIdSchema, "params"), deleteTask);

export default router;
