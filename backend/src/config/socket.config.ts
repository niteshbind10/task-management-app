import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import logger from "@/config/logger.config";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.trim() : "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.debug(`Socket client connected: ${socket.id}`);

    // Join room corresponding to userId
    socket.on("join", (userId: string) => {
      if (userId) {
        socket.join(userId);
        logger.debug(`Socket client ${socket.id} joined room: ${userId}`);
      }
    });

    socket.on("disconnect", () => {
      logger.debug(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
