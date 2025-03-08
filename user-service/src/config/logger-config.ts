import { createLogger, format, transports } from "winston";
import { server_config } from "./server-config";
const { NODE_ENV } = server_config

export const logger = createLogger({
  level: NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.prettyPrint(),
  ),
  defaultMeta: { service: 'User-service' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.printf(({ level, message, timestamp }) => {
          return `${JSON.stringify(timestamp)} ${level}: ${JSON.stringify(message)}`;
        }),
      ),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
})