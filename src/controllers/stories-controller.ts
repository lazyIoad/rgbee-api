import { Context } from 'koa';
import Story from '../models/story-model';

export const post = async (ctx: Context): Promise<void> => {
  const { title, url, text } = ctx.request.body;

  const story = await Story.transaction(async (trx) => {
    return Story.query(trx).insertGraph({
      title,
      url,
      text,
      thread: {},
      authorId: ctx.state.user.id,
    });
  });

  ctx.body = story;
};

export const getById = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params;
  const story = await Story.query().findById(id);
  ctx.body = story;
};
