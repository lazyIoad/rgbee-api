import { Context } from 'koa';
import User from '../models/user-model';

export const getSavedStories = async (ctx: Context): Promise<void> => {
  const stories = await User.relatedQuery('savedStories').for(ctx.state.user.id);
  ctx.body = stories;
};

export const getSavedComments = async (ctx: Context): Promise<void> => {
  const comments = await User.relatedQuery('savedComments').for(ctx.state.user.id);
  ctx.body = comments;
};
