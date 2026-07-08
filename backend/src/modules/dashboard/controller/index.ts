import { Request, Response, NextFunction } from "express";
import { getStats } from "../services";
import { sendSuccess } from "@/helpers/response.helper";

export const getDashboardStats = async (
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

    const stats = await getStats(userId);
    sendSuccess(res, "Dashboard stats retrieved successfully", stats);
  } catch (error) {
    next(error);
  }
};
