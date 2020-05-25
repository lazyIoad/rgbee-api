import { Context } from 'koa';
import Story from '../models/story-model';
import User from '../models/user-model';
import { BadRequestError } from '../../helpers/error-helper';

/**
 * Fetches the list of stories ranked by newness.
 * @todo Cache this result in redis.
 * @todo Fix default selects.
 * @param ctx
 */
export const getNewStories = async (ctx: Context): Promise<void> => {
  ctx.body = await Story.query().modify('orderByNew');
};

/**
 * Fetches the list of stories ranked by popularity.
 * @todo Cache this result in redis.
 * @todo Fix default selects.
 * @param ctx
 */
export const getPopularStories = async (ctx: Context): Promise<void> => {
  ctx.body = await Story.query().modify('orderByPopularity');
};

/**
 * Creates a new story and container comment thread and runs the validations
 * specified in stories-validator. Also creates a new upvote by the user on
 * the story.
 * @todo Invalidate cache entries containing stories.
 * @todo Fix default selects.
 * @param ctx
 */
export const postCreateStory = async (ctx: Context): Promise<void> => {
  const { title, url, body } = ctx.request.body;

  const story = await Story.transaction(async (trx) => {
    const insertedStory = await Story.query(trx).insertGraph({
      title,
      url,
      body,
      thread: {
        authorId: ctx.state.user.id,
      },
      authorId: ctx.state.user.id,
    });

    // Create a default upvote from this user to their story
    await User.relatedQuery('upvotedStories', trx)
      .for(ctx.state.user.id)
      .relate(insertedStory.id)
      .throwIfNotFound();
    return {
      id: insertedStory.id,
    };
  });

  ctx.body = story;
};

/**
 * Fetches a story by its id.
 * @todo Fix default selects.
 * @param ctx
 */
export const getStoryById = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const story = await Story.query()
    .findById(storyId)
    .throwIfNotFound()
    .modify('selectDefaultFields');
  ctx.body = story;
};

/**
 * Either creates an upvote from this user to the selected story, or
 * removes a previously created one.
 * @param ctx
 */
export const postUpvoteStory = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const { undo } = ctx.request.body;

  await Story.transaction(async (trx) => {
    const upvotedStories = User.relatedQuery('upvotedStories', trx).for(ctx.state.user.id);

    // Check if existing downvote for this story exists
    const downvote = await User.relatedQuery('downvotedStories', trx)
      .for(ctx.state.user.id)
      .where('stories.id', storyId)
      .select('id');

    if (downvote.length) {
      throw new BadRequestError('Cannot upvote an already downvoted post.');
    }

    if (undo) {
      await upvotedStories.unrelate().where('stories.id', storyId);
    } else {
      await upvotedStories.relate(storyId);
    }
  });

  ctx.status = 200;
};

export const postDownvoteStory = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const { undo } = ctx.request.body;

  await Story.transaction(async (trx) => {
    const downvotedStories = User.relatedQuery('downvotedStories').for(ctx.state.user.id);

    // Check if existing upvote for this story exists
    const upvote = await User.relatedQuery('upvotedStories', trx)
      .for(ctx.state.user.id)
      .where('stories.id', storyId)
      .select('id');

    if (upvote.length) {
      throw new BadRequestError('Cannot downvote an already upvoted post.');
    }

    if (undo) {
      await downvotedStories.unrelate().where('stories.id', storyId);
    } else {
      await downvotedStories.relate(storyId);
    }
  });

  ctx.status = 200;
};

export const postSaveStory = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const { undo } = ctx.request.body;

  const savedStories = User.relatedQuery('savedStories').for(ctx.state.user.id);

  if (undo) {
    await savedStories.unrelate().where('stories.id', storyId);
  } else {
    await savedStories.relate(storyId);
  }

  ctx.body = 200;
};
