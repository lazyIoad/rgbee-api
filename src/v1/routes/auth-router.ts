import Router from '@koa/router';
import { DefaultState, Context } from 'koa';
import authenticated from '../../utils/auth-util';
import { postRegister, postLogin, postLogout } from '../controllers/auth-controller';

const router = new Router<DefaultState, Context>();

router.post('/register', postRegister);
router.post('/login', postLogin);
router.post('/logout', authenticated(), postLogout);

export default router.routes();
