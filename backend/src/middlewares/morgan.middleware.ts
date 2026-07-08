import morgan from "morgan";
import logger from "@/config/logger.config";

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

const requestLogger = morgan(format, { stream });

export default requestLogger;
