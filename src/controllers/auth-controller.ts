import { Context, Next } from 'koa';
import passport from 'koa-passport';
import { NotFoundError } from 'objection';
import User from '../models/user-model';

const handleLogin = (ctx: Context, next: Next): Promise<void> => {
  return passport.authenticate('local', (err, user) => {
    if (user) {
      ctx.login(user);
      ctx.redirect('/auth/status');
    } else if (err) {
      ctx.body = {
        message: err.message,
        type: err.type,
        data: {},
      };

      ctx.throw(400);
    } else {
      // TODO: fix this error
      throw new NotFoundError('Incorrect username or password');
    }
  })(ctx, next);
};

export const postRegister = async (ctx: Context, next: Next): Promise<void> => {
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

  return handleLogin(ctx, next);
};

export const postLogin = (ctx: Context, next: Next): Promise<void> => {
  return handleLogin(ctx, next);
};

export const postLogout = (ctx: Context): void => {
  ctx.logout();
  ctx.redirect('/auth/status');
};
