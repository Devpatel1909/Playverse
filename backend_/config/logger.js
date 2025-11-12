const winston = require('winston');
const path = require('path');
const config = require('./config');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: logFormat,
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add file transport in production
if (config.isProduction()) {
  logger.add(new winston.transports.File({
    filename: path.join(__dirname, '..', 'logs', 'error.log'),
    level: 'error'
  }));
  
  logger.add(new winston.transports.File({
    filename: path.join(__dirname, '..', 'logs', 'app.log')
  }));
}

module.exports = logger;
