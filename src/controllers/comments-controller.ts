import { Context } from 'koa';
import Comment from '../models/comment-model';

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
  text: string,
  storyId: number,
  authorId: number,
  parentId: number,
): Promise<Comment> => {
  return Comment.query().insert({
    text,
    storyId,
    authorId,
    parentId,
  });
};

export const postCreateComment = async (ctx: Context): Promise<void> => {
  const { text } = ctx.request.body;
  const { storyId } = ctx.params;
  const thread = await Comment.query().findOne({ storyId });
  const comment = await createComment(text, storyId, ctx.state.user.id, thread.id);
  ctx.body = comment;
};

export const postCreateSubComment = async (ctx: Context): Promise<void> => {
  const { text } = ctx.request.body;
  const { storyId, commentId } = ctx.params;
  const comment = await createComment(text, storyId, ctx.state.user.id, commentId);
  ctx.body = comment;
};

export const postUpvoteComment = async (ctx: Context): Promise<void> => {
  const { commentId } = ctx.params;
  const comment = await Comment.query().findById(commentId).increment('numUpvotes', 1);
  ctx.body = comment;
};

export const postDownvoteComment = async (ctx: Context): Promise<void> => {
  const { commentId } = ctx.params;
  const comment = await Comment.query().findById(commentId).increment('numDownvotes', 1);
  ctx.body = comment;
};
