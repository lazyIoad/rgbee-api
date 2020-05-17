import { Context } from 'koa';
import Story from '../models/story-model';
import User from '../models/user-model';
import { BadRequestError } from '../helpers/error-helper';

export const getNewStories = async (ctx: Context): Promise<void> => {
  ctx.body = await Story.query().modify('orderByNew');
};

export const getPopularStories = async (ctx: Context): Promise<void> => {
  ctx.body = await Story.query().modify('orderByPopularity');
};

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
  const { undo } = ctx.request.body;

  const numModified = await Story.transaction(async (trx) => {
    const upvotedStories = User.relatedQuery('upvotedStories', trx).for(ctx.state.user.id);
    const story = Story.query(trx).findById(storyId);

    // Check if existing downvote for this story exists
    const downvote = await User.relatedQuery('downvotedStories', trx)
      .for(ctx.state.user.id)
      .where('stories.id', storyId)
      .select('id');

    if (downvote.length) {
      throw new BadRequestError();
    }

    if (undo) {
      await upvotedStories.unrelate().where('stories.id', storyId);
      return story.decrement('numUpvotes', 1);
    }

    await upvotedStories.relate(storyId);
    return story.increment('numUpvotes', 1);
  });

  ctx.body = numModified;
};

export const postDownvoteStory = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const { undo } = ctx.request.body;

  const numModified = await Story.transaction(async (trx) => {
    const downvotedStories = User.relatedQuery('downvotedStories').for(ctx.state.user.id);
    const story = Story.query(trx).findById(storyId);

    // Check if existing upvote for this story exists
    const upvote = await User.relatedQuery('upvotedStories', trx)
      .for(ctx.state.user.id)
      .where('stories.id', storyId)
      .select('id');

    if (upvote.length) {
      throw new BadRequestError();
    }

    if (undo) {
      await downvotedStories.unrelate().where('stories.id', storyId);
      return story.decrement('numDownvotes', 1);
    }

    await downvotedStories.relate(storyId);
    return story.increment('numDownvotes', 1);
  });

  ctx.body = numModified;
};

export const postSaveStory = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const { undo } = ctx.request.body;

  const savedStories = User.relatedQuery('savedStories').for(ctx.state.user.id);
  const numModified = undo
    ? await savedStories.relate(storyId)
    : await savedStories.unrelate().where('stories.id', storyId);

  ctx.body = numModified;
};
