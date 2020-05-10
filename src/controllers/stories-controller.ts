import { Context } from 'koa';
import Story from '../models/story-model';
import User from '../models/user-model';

export const postCreateStory = async (ctx: Context): Promise<void> => {
  const { title, url, body } = ctx.request.body;

  const story = await Story.transaction(async (trx) => {
    return Story.query(trx).insertGraph({
      title,
      url,
      body,
      thread: {
        authorId: ctx.state.user.id,
      },
      authorId: ctx.state.user.id,
    });
  });

  ctx.body = story;
};

export const getStoryById = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const story = await Story.query().findById(storyId);
  ctx.body = story;
};

export const postUpvoteStory = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const story = await Story.transaction(async (trx) => {
    await User.relatedQuery('upvotedStories', trx).for(ctx.state.user.id).relate(storyId);
    return Story.query(trx).findById(storyId).increment('numUpvotes', 1);
  });
  ctx.body = story;
};

export const postDownvoteStory = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const story = await Story.transaction(async (trx) => {
    await User.relatedQuery('downvotedStories').for(ctx.state.user.id).relate(storyId);
    return Story.query(trx).findById(storyId).increment('numDownvotes', 1);
  });
  ctx.body = story;
};

export const postSaveStory = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const story = await User.relatedQuery('savedStories').for(ctx.state.user.id).relate(storyId);
  ctx.body = story;
};
