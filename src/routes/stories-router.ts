import Router from 'koa-router';
import { DefaultState, Context } from 'koa';
import authenticated from '../utils/auth-util';
import { postCreate } from '../controllers/stories-controller';

const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/stories',
});

router.post('/', authenticated(), postCreate);

export default router.routes();
