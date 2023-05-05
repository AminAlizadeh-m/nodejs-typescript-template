import winston, { transports } from 'winston';
import path from 'path';

const getPathLogs = () => path.join(__dirname, '../../../.logs');

const logger = winston.createLogger({
  format: winston.format.json(),
  handleExceptions: true,
  handleRejections: true,
  rejectionHandlers: [
    new transports.File({ filename: 'rejections.log', dirname: getPathLogs() }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log', dirname: getPathLogs() }),
  ],
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      dirname: getPathLogs(),
    }),
    new winston.transports.File({
      filename: 'http.log',
      level: 'http',
      dirname: getPathLogs(),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'error',
      format: winston.format.combine(winston.format.prettyPrint()),
      handleExceptions: true,
      handleRejections: true,
    }),
  );
}

export default logger;
