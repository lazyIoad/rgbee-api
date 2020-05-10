import Router from 'koa-router';
import { DefaultState, Context } from 'koa';
import authenticated from '../utils/auth-util';
import { getSavedStories, getSavedComments } from '../controllers/users-controller';

const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/users',
});

router.get('/savedStories', authenticated(), getSavedStories);
router.get('/savedComments', authenticated(), getSavedComments);

export default router.routes();
