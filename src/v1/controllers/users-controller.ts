import { Context } from 'koa';
import User from '../models/user-model';

export const getUser = async (ctx: Context): Promise<void> => {
  const { username } = ctx.params;
  const userQuery = User.query().findOne({ username });

  if (ctx.isAuthenticated() && ctx.state.user.username === username) {
    userQuery.modify('selectSelfFields');
  } else {
    userQuery.modify('selectDefaultFields');
  }

  ctx.body = await userQuery;
};

export const getSavedStories = async (ctx: Context): Promise<void> => {
  const { username } = ctx.params;
  const user = await User.query().findOne({ username });
  const stories = await user.$relatedQuery('savedStories');
  ctx.body = stories;
};

export const getSavedComments = async (ctx: Context): Promise<void> => {
  const { username } = ctx.params;
  const user = await User.query().findOne({ username });
  const comments = await user.$relatedQuery('savedComments');
  ctx.body = comments;
};
