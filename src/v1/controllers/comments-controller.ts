import { Context } from 'koa';
import Comment from '../models/comment-model';
import User from '../models/user-model';
import { BadRequestError } from '../../helpers/error-helper';
import Story from '../models/story-model';

export const getCommentById = async (ctx: Context): Promise<void> => {
  const { commentId } = ctx.params;
  const comment = await Comment.query()
    .findById(commentId)
    .withGraphFetched('[children(orderByKarma).^]');
  ctx.body = comment;
};

export const getStoryComments = async (ctx: Context): Promise<void> => {
  const { storyId } = ctx.params;
  const thread = await Comment.query()
    .findOne({ storyId })
    .withGraphFetched('[children(orderByKarma).^]');
  ctx.body = thread;
};

const createComment = (
  body: string,
  storyId: number,
  authorId: number,
  parentId: number,
): Promise<Comment> => {
  return Comment.transaction(async (trx) => {
    await Story.query(trx).findById(storyId).increment('numComments', 1);
    return Comment.query(trx).insert({
      body,
      storyId,
      authorId,
      parentId,
    });
  });
};

export const postCreateComment = async (ctx: Context): Promise<void> => {
  const { body } = ctx.request.body;
  const { storyId } = ctx.params;
  const thread = await Comment.query().findOne({ storyId });
  const comment = await createComment(body, storyId, ctx.state.user.id, thread.id);
  ctx.body = comment;
};

export const postCreateSubComment = async (ctx: Context): Promise<void> => {
  const { body } = ctx.request.body;
  const { storyId, commentId } = ctx.params;
  const comment = await createComment(body, storyId, ctx.state.user.id, commentId);
  ctx.body = comment;
};

export const postUpvoteComment = async (ctx: Context): Promise<void> => {
  const { commentId } = ctx.params;
  const { undo } = ctx.request.body;

  const numModified = await Comment.transaction(async (trx) => {
    const upvotedComments = User.relatedQuery('upvotedComments', trx).for(ctx.state.user.id);

    // Check if existing downvote for this comment exists
    const downvote = await User.relatedQuery('downvotedComments', trx)
      .for(ctx.state.user.id)
      .where('comments.id', commentId)
      .select('id');

    if (downvote.length) {
      throw new BadRequestError();
    }

    if (undo) {
      await upvotedComments.unrelate().where('comments.id', commentId);
    } else {
      await upvotedComments.relate(commentId);
    }
  });

  ctx.body = numModified;
};

export const postDownvoteComment = async (ctx: Context): Promise<void> => {
  const { commentId } = ctx.params;
  const { undo } = ctx.request.body;

  const numModified = await Comment.transaction(async (trx) => {
    const downvotedComments = User.relatedQuery('downvotedComments', trx).for(ctx.state.user.id);

    // Check if existing upvote for this comment exists
    const upvote = await User.relatedQuery('upvotedComments', trx)
      .for(ctx.state.user.id)
      .where('comments.id', commentId)
      .select('id');

    if (upvote.length) {
      throw new BadRequestError();
    }

    if (undo) {
      await downvotedComments.unrelate().where('comments.id', commentId);
    } else {
      await downvotedComments.relate(commentId);
    }
  });

  ctx.body = numModified;
};

export const postSaveComment = async (ctx: Context): Promise<void> => {
  const { commentId } = ctx.params;
  const { undo } = ctx.request.body;

  const savedComments = User.relatedQuery('savedComments').for(ctx.state.user.id);
  const numModified = undo
    ? await savedComments.relate(commentId)
    : await savedComments.unrelate().where('comments.id', commentId);

  ctx.body = numModified;
};
