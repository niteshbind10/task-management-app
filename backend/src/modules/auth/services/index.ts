import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories";
import { UserAttributes, UserCreationAttributes, JwtPayload } from "@/interfaces/user.types";
import { AppError } from "@/middlewares/error.middleware";

export const register = async (data: UserCreationAttributes): Promise<Omit<UserAttributes, "password">> => {
  const existing = await UserRepository.findOne({ email: data.email });
  if (existing) {
    throw new AppError("A user with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password!, 10);
  const user = await UserRepository.create({
    fullName: data.fullName,
    email: data.email,
    password: hashedPassword,
  });

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  return {
    id: userWithoutPassword._id.toString(),
    fullName: userWithoutPassword.fullName,
    email: userWithoutPassword.email,
    createdAt: userWithoutPassword.createdAt,
    updatedAt: userWithoutPassword.updatedAt,
  };
};

export const login = async (
  email: string,
  password?: string,
  rememberMe: boolean = false
): Promise<{ user: Omit<UserAttributes, "password">; token: string }> => {
  if (!password) {
    throw new AppError("Password is required", 400);
  }

  const user = await UserRepository.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new AppError("JWT secret key not configured", 500);
  }

  const payload: JwtPayload = {
    userId: user._id.toString(),
  };

  const expiresIn = rememberMe
    ? process.env.JWT_REMEMBER_ME_EXPIRES_IN || "7d"
    : process.env.JWT_EXPIRES_IN || "1h";

  const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn as any });

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  return {
    user: {
      id: userWithoutPassword._id.toString(),
      fullName: userWithoutPassword.fullName,
      email: userWithoutPassword.email,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
    },
    token,
  };
};

export const getMe = async (userId: string): Promise<Omit<UserAttributes, "password"> | null> => {
  const user = await UserRepository.findById(userId);
  if (!user) return null;

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  return {
    id: userWithoutPassword._id.toString(),
    fullName: userWithoutPassword.fullName,
    email: userWithoutPassword.email,
    createdAt: userWithoutPassword.createdAt,
    updatedAt: userWithoutPassword.updatedAt,
  };
};
