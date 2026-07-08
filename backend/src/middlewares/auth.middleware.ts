import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/interfaces/user.types";
import { AppError } from "@/middlewares/error.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError("Authentication required. Please login.", 401);
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new AppError("JWT secret key not configured", 500);
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError("Invalid or expired token. Please login again.", 401));
  }
};
