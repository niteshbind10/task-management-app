import { Request, Response, NextFunction } from "express";
import * as authService from "../services";
import { sendSuccess } from "@/helpers/response.helper";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.register(req.body);
    sendSuccess(res, "Registration successful", user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;
    const { user, token } = await authService.login(email, password, rememberMe);

    const isProduction = process.env.NODE_ENV === "production";
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge,
    });

    sendSuccess(res, "Login successful", { user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });
    sendSuccess(res, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
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

    const user = await authService.getMe(userId);
    sendSuccess(res, "User profile fetched successfully", user);
  } catch (error) {
    next(error);
  }
};
