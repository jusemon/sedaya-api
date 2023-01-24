import morgan from 'morgan';
import { Config } from '../models/config';
import logger from '../utils/logger';

const stream = (config: Config) => ({
  write: (message: string) => logger(config).http(message.trim()),
});

export const loggerMiddleware = (config: Config) =>
  morgan(
    ':remote-addr :method :url :status :res[content-length] - :response-time ms',
    { stream: stream(config) }
  );
