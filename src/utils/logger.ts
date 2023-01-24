import winston from 'winston';
import { Config } from '../models/config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

const level = (config: Config) => {
  return config.isDevelopment ? 'debug' : 'warn';
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.json(),
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

let _logger: winston.Logger;
const logger = (config: Config) => {
  if (_logger) {
    return _logger;
  }
  _logger = winston.createLogger({
    level: level(config),
    levels,
    format,
    transports,
  });
  return _logger;
};

export default logger;
