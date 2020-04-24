import { Context } from 'koa';
import argon2 from 'argon2';
import User from '../models/user-model';

export const post = async (ctx: Context): Promise<void> => {
  const { password } = ctx.request.body;

  if (password) {
    ctx.request.body.password = await argon2.hash(password, { type: argon2.argon2i });
  }

  const user = await User.query().insert(ctx.request.body);
  ctx.body = user;
};

export const postLogin = () => {};
