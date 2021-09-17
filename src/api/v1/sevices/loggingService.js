const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  level: process.env.LOG_LEVEL,
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
