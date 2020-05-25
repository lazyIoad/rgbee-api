import { Context } from 'koa';
import User from '../models/user-model';

export const getMe = async (ctx: Context): Promise<void> => {
  const userQuery = User.query()
    .findById(ctx.state.user.id)
    .throwIfNotFound()
    .modify('selectDefaultFields');
  ctx.body = await userQuery;
};

export const getUser = async (ctx: Context): Promise<void> => {
  const { username } = ctx.params;
  const userQuery = User.query()
    .findOne({ username })
    .throwIfNotFound()
    .modify('selectProfileFields');
  const user = await userQuery;
  ctx.body = user;
};

export const getSavedStories = async (ctx: Context): Promise<void> => {
  const { username } = ctx.params;
  const user = await User.query().findOne({ username }).throwIfNotFound();
  const stories = await user.$relatedQuery('savedStories');
  ctx.body = stories;
};

export const getSavedComments = async (ctx: Context): Promise<void> => {
  const { username } = ctx.params;
  const user = await User.query().findOne({ username }).throwIfNotFound();
  const comments = await user.$relatedQuery('savedComments').throwIfNotFound();
  ctx.body = comments;
};
