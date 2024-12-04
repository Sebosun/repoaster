import winston from "winston";

const logger = winston.createLogger({
  level: "debug", // Set the default log level (e.g., debug, info, warn, error)
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps to logs
    winston.format.json(), // Format logs in JSON format (optional)
  ),
  transports: [
    new winston.transports.Console({
      // Log to console
      format: winston.format.combine(
        winston.format.colorize(), // Add color to console logs
        winston.format.simple(), // Format console logs for readability
      ),
    }),
    // Add other transports (e.g., file, database) here
  ],
});

export { logger };
