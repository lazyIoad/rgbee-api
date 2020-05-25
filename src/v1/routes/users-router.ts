import Router from '@koa/router';
import { DefaultState, Context } from 'koa';
import authenticated from '../../utils/auth-util';
import { getSavedStories, getSavedComments, getMe, getUser } from '../controllers/users-controller';

const router = new Router<DefaultState, Context>();

router.get('/me', authenticated(), getMe);
router.get('/:username', getUser);
router.get('/:username/savedStories', getSavedStories);
router.get('/:username/savedComments', getSavedComments);

export default router.routes();
