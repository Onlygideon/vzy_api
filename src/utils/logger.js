import winston from "winston";
import { MongoDB as winstonMongoDB } from "winston-mongodb";
import { MongoClient } from "mongodb";
import env from "../config/env.js";

let { DB_CLUSTER_NAME, DB_NAME, DB_PASSWORD, DB_USERNAME } = env();

let mongoUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER_NAME}.tl7iv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const mongoLocal = "mongodb://127.0.0.1:27017/vzy";
let mongoConnection;

if (DB_USERNAME && DB_PASSWORD) {
  mongoConnection = new MongoClient(mongoUrl, {});
} else {
  mongoConnection = new MongoClient(mongoLocal, {});
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf((info) => {
      const { timestamp, level, message, meta } = info;
      const req = meta && meta.req;
      const res = meta && meta.res;
      const requestId = req && req.id;
      const statusCode = res && res.statusCode;
      const durationMs = meta && meta.durationMs;

      const logMessage = `${timestamp} [${level}] ${
        requestId ? `[${requestId}] ` : ""
      }${message} ${req ? `(${req.method} ${req.originalUrl})` : ""} ${
        statusCode ? `status=${statusCode}` : ""
      } ${durationMs ? `durationMs=${durationMs}` : ""}`;

      return logMessage;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winstonMongoDB({
      db: mongoConnection,
      collection: "log",
      options: { useUnifiedTopology: true },
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

const logFunctions = {
  info: (message) => {
    logger.info(message);
  },

  error: (message) => {
    logger.error(message);
  },

  warn: (message) => {
    logger.warn(message);
  },

  debug: (message) => {
    logger.debug(message);
  },

  logUserActivity: (userId, action) => {
    logger.info(`User ${userId} performed action: ${action}`);
  },

  logServerResponse: (statusCode, url, method, duration) => {
    logger.info(
      `${method} ${url} responded with ${statusCode} in ${duration} ms`
    );
  },
};

export default logFunctions;
