import { Context, Next } from 'koa';
import passport from 'koa-passport';
import { DataError } from 'objection';
import { UnauthorizedError, UnknownError } from '../../helpers/error-helper';
import User from '../models/user-model';

/**
 * Creates a new user and runs the validations specified in user-validator.
 * @param ctx
 */
export const postRegister = async (ctx: Context): Promise<void> => {
  const { email, username, password } = ctx.request.body;

  await User.query().insert({
    email,
    username,
    password,
  });

  ctx.status = 200;
};

/**
 * Logs in a user using passport.
 * @param ctx
 * @param next
 */
export const postLogin = (ctx: Context, next: Next): Promise<void> => {
  return passport.authenticate('local', (err, user) => {
    if (user) {
      ctx.login(user).catch((e) => {
        throw new UnknownError(e);
      });
      ctx.status = 200;
    } else if (err) {
      throw new DataError();
    } else {
      throw new UnauthorizedError('Incorrect username or password');
    }
  })(ctx, next);
};

/**
 * Logs out a user using passport.
 * @param ctx
 */
export const postLogout = (ctx: Context): void => {
  ctx.logout();
  ctx.status = 200;
};
