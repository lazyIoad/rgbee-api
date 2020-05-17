import Router from '@koa/router';
import { DefaultState, Context } from 'koa';
import authRouter from './auth-router';
import usersRouter from './users-router';
import storiesRouter from './stories-router';

const v1Router = new Router<DefaultState, Context>({
  prefix: '/v1',
});

v1Router.use('/auth', authRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/stories', storiesRouter);

export default v1Router.routes();
