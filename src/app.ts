import Koa from 'koa';
import Knex from 'knex';
import morgan from 'koa-morgan';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';
import { Model } from 'objection';
import { loggerStream } from './helpers/logger-helper';
import userRouter from './routes/users-router';
import errorHandler from './helpers/error-helper';

// knexfile does not support ES6 modules, so we need to require it
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = new Koa();

app.use(helmet());
app.use(bodyParser());
app.use(morgan('common', { stream: loggerStream }));

app.use(errorHandler);
app.use(userRouter);

export default app;
