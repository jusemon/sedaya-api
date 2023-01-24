import express, { Express } from 'express';
import config from './config';
import { loggerMiddleware } from './middlewares/logger';
import route from './routes';

const { server } = config;
const app: Express = express();

app.use(loggerMiddleware(config));
app.use(express.json());
app.use(`/api/v${server.apiVersion}`, route);
app.listen(server.port, () => {
  console.log(`Server started at port ${server.port}`);
});
