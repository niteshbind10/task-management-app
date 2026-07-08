import { Request, Response, NextFunction } from "express";
import * as taskService from "../services";
import { sendSuccess } from "@/helpers/response.helper";
import { getIO } from "@/config/socket.config";
import logger from "@/config/logger.config";

const emitSocketEvent = (userId: string, event: string, data: any) => {
  try {
    const io = getIO();
    io.to(userId).emit(event, data);
    logger.debug(`Emitted socket event: ${event} to user: ${userId}`);
  } catch (error) {
    logger.warn(`Failed to emit socket event: ${(error as Error).message}`);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }

    const task = await taskService.createTask(userId, req.body);

    emitSocketEvent(userId, "task:created", task);

    sendSuccess(res, "Task created successfully", task, 201);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }

    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const sortBy = req.query.sortBy as string;
    const order = req.query.order as string;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const skip = req.query.skip ? Number(req.query.skip) : undefined;

    const data = await taskService.getAllTasks(userId, { status, priority, sortBy, order, limit, skip });
    sendSuccess(res, "Tasks retrieved successfully", data);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }

    const task = await taskService.getTaskById(userId, id);
    sendSuccess(res, "Task retrieved successfully", task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }

    const task = await taskService.updateTask(userId, id, req.body);

    emitSocketEvent(userId, "task:updated", task);

    sendSuccess(res, "Task updated successfully", task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }

    await taskService.deleteTask(userId, id);

    emitSocketEvent(userId, "task:deleted", { id });

    sendSuccess(res, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
};
