import Koa, { DefaultState, Context } from 'koa';
import Knex from 'knex';
import morgan from 'koa-morgan';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import { Model } from 'objection';
import './configs/passport-config';
import Router from '@koa/router';
import errorHandler from './helpers/error-helper';
import sessionConfig from './configs/session-config';
import { loggerStream } from './helpers/logger-helper';
import { SESSION_SECRET } from './utils/secrets-util';
import v1Router from './v1/routes/v1-router';

// knexfile does not support ES6 modules, so we need to require it
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = new Koa();

// Session store
app.keys = [SESSION_SECRET || 'very secret'];
app.use(session(sessionConfig, app));

// Security
app.use(helmet());

// Utils
app.use(bodyParser());

// Logging
app.use(morgan('common', { stream: loggerStream }));

// Error handling
app.use(errorHandler);

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes
const apiRouter = new Router<DefaultState, Context>({
  prefix: '/api',
});

apiRouter.use(v1Router);

app.use(apiRouter.routes());

export default app;
