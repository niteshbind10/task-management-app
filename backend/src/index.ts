import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import swaggerUi from "swagger-ui-express";

import logger from "@/config/logger.config";
import { connectDB, testConnection } from "@/config/db.config";
import { initSocket } from "@/config/socket.config";
import requestLogger from "@/middlewares/morgan.middleware";
import { errorHandler } from "@/middlewares/error.middleware";
import { rateLimiter } from "@/middlewares/rateLimiter.middleware";
import router from "@/routes";
import swaggerSpec from "@/docs/swagger";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.trim() : "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(helmet());
app.use(hpp());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.use("/api", rateLimiter);

app.use("/", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Task Management API is running" });
});

app.use(errorHandler);

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    await testConnection();
    logger.info("Database connection verified.");

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      logger.info(`Server running on port: ${PORT}`);
      logger.info(`CORS origin allowed: ${corsOrigin}`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
