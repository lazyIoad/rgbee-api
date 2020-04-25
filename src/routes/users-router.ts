import Router from 'koa-router';
import { DefaultState, Context } from 'koa';
import { post } from '../controllers/users-controller';

const router = new Router<DefaultState, Context>();

router.post('/users', post);

export default router.routes();
