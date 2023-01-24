import express, { Express } from 'express';
import config from './config';
import { loggerMiddleware } from './middlewares/logger';

const app: Express = express();
const port: number = 3001;

app.use(loggerMiddleware(config));
app.use(express.json());
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
