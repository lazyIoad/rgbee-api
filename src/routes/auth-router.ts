import Router from 'koa-router';
import { DefaultState, Context } from 'koa';
import { postRegister, postLogin, postLogout } from '../controllers/auth-controller';

const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/auth',
});

router.post('/register', postRegister);
router.post('/login', postLogin);
router.post('/logout', postLogout);

router.get('/status', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    authenticated: ctx.isAuthenticated(),
    user: ctx.state.user,
  };
});

export default router.routes();
