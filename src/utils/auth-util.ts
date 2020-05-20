import { Context, Next } from 'koa';
import { UnauthorizedError } from '../helpers/error-helper';

export default () => {
  return (ctx: Context, next: Next): Promise<unknown> => {
    if (ctx.isAuthenticated()) {
      return next();
    }

    throw new UnauthorizedError();
  };
};
