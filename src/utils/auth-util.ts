import { Context, Next } from 'koa';

export default () => {
  return (ctx: Context, next: Next): Promise<unknown> => {
    if (ctx.isAuthenticated()) {
      return next();
    }

    ctx.throw(401);
  };
};
