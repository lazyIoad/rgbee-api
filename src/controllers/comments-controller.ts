import { Context } from 'koa';
import Comment from '../models/comment-model';
import User from '../models/user-model';

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
  return Comment.query().insert({
    body,
    storyId,
    authorId,
    parentId,
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
  const comment = await Comment.transaction(async (trx) => {
    await User.relatedQuery('upvotedComments', trx).for(ctx.state.user.id).relate(commentId);
    return Comment.query(trx).findById(commentId).increment('numUpvotes', 1);
  });
  ctx.body = comment;
};

export const postDownvoteComment = async (ctx: Context): Promise<void> => {
  const { commentId } = ctx.params;
  const comment = await Comment.transaction(async (trx) => {
    await User.relatedQuery('downvotedComments').for(ctx.state.user.id).relate(commentId);
    return Comment.query(trx).findById(commentId).increment('numDownvotes', 1);
  });
  ctx.body = comment;
};

export const postSaveComment = async (ctx: Context): Promise<void> => {
  const { commentId } = ctx.params;
  const comment = await User.relatedQuery('savedComments').for(ctx.state.user.id).relate(commentId);
  ctx.body = comment;
};
