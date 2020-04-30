import Router from 'koa-router';
import { DefaultState, Context } from 'koa';
import authenticated from '../utils/auth-util';
import { getById, post } from '../controllers/stories-controller';

const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/stories',
});

router.post('/', authenticated(), post);
router.get('/:id', getById);

export default router.routes();
