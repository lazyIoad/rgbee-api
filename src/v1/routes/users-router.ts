import Router from '@koa/router';
import { DefaultState, Context } from 'koa';
import { getSavedStories, getSavedComments, getUser } from '../controllers/users-controller';

const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/users',
});

router.get('/:username', getUser);
router.get('/:username/savedStories', getSavedStories);
router.get('/:username/savedComments', getSavedComments);

export default router.routes();
