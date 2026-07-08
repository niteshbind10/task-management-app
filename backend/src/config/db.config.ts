import mongoose from "mongoose";
import logger from "@/config/logger.config";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task_management";
    await mongoose.connect(mongoURI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export const testConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Database not connected");
  }
};

export default mongoose.connection;
