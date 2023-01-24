import express, { Express } from 'express';
import config from './config';
import roles from './routes/roles.route';
import users from './routes/users.route';
import { loggerMiddleware } from './middlewares/logger';

const app: Express = express();
const port: number = 3001;

app.use(loggerMiddleware(config));
app.use(express.json());
app.use('/roles', roles);
app.use('/users', users);
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
