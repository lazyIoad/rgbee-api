import { Context } from 'koa';
import Story from '../models/story-model';

export const postCreateStory = async (ctx: Context): Promise<void> => {
  const { title, url, text } = ctx.request.body;

  const story = await Story.transaction(async (trx) => {
    return Story.query(trx).insertGraph({
      title,
      url,
      text,
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
