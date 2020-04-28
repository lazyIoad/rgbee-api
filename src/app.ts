import Koa from 'koa';
import Knex from 'knex';
import morgan from 'koa-morgan';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import { Model } from 'objection';
import './configs/passport-config';
import authRouter from './routes/auth-router';
import storiesRouter from './routes/stories-router';
import errorHandler from './helpers/error-helper';
import { loggerStream } from './helpers/logger-helper';
import { SESSION_SECRET } from './utils/secrets-util';

// knexfile does not support ES6 modules, so we need to require it
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = new Koa();

// Session store
app.keys = [SESSION_SECRET || 'very secret'];
app.use(session(app));

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
app.use(authRouter);
app.use(storiesRouter);

export default app;
