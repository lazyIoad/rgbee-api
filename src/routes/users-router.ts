import Router from 'koa-router';
import { post } from '../controllers/users-controller';

const router = new Router();

router.post('/users', post);

export default router.routes();
