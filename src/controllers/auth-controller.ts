import { Context, Next } from 'koa';
import passport from 'koa-passport';
import { DataError } from 'objection';
import { UnauthorizedError } from '../helpers/error-helper';
import User from '../models/user-model';

const handleLogin = (ctx: Context, next: Next): Promise<void> => {
  return passport.authenticate('local', (err, user) => {
    if (user) {
      ctx.login(user);
      ctx.status = 200;
    } else if (err) {
      throw new DataError();
    } else {
      throw new UnauthorizedError('Incorrect username or password');
    }
  })(ctx, next);
};

export const postRegister = async (ctx: Context): Promise<void> => {
  const { email, username, password } = ctx.request.body;

  let hashedPassword;
  if (password) {
    hashedPassword = await User.generatePasswordHash(password);
  }

  await User.query().insert({
    email,
    username,
    password: hashedPassword,
  });

  ctx.status = 200;
};

export const postLogin = (ctx: Context, next: Next): Promise<void> => {
  return handleLogin(ctx, next);
};

export const postLogout = (ctx: Context): void => {
  ctx.logout();
  ctx.status = 200;
};
