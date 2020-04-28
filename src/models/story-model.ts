import { Model } from 'objection';
import Comment from './comment-model';
import User from './user-model';

export default class Story extends Model {
  id!: number;

  title!: string;

  url?: string;

  text?: string;

  authorId!: number;

  author!: User;

  thread!: Comment;

  static get tableName(): string {
    return 'stories';
  }

  static get jsonSchema(): object {
    return {
      type: 'object',
      required: ['title'],

      properties: {
        title: { type: 'string', maxLength: 100 },
        url: {
          type: 'string',
          maxLength: 2000,
          format: 'hostname',
        },
        text: { type: 'string', maxLength: 4000 },
      },
    };
  }

  static relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'stories.authorId',
        to: 'users.id',
      },
    },
    thread: {
      relation: Model.HasOneRelation,
      modelClass: Comment,
      join: {
        from: 'stories.id',
        to: 'comments.storyId',
      },
    },
  };
}
