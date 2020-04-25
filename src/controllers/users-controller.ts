import { Context } from 'koa';
import User from '../models/user-model';

export const post = async (ctx: Context): Promise<void> => {
  const { email, username, password, about } = ctx.request.body;

  let hashedPassword;
  if (password) {
    hashedPassword = await User.hashPassword(password);
  }

  const user = await User.query().insert({
    email,
    username,
    about,
    password: hashedPassword,
  });

  ctx.body = user;
};

export const postLogin = () => {};
