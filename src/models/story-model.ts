import { Model, JSONSchema, RelationMappings } from 'objection';
// eslint-disable-next-line import/no-cycle
import Comment from './comment-model';
// eslint-disable-next-line import/no-cycle
import User from './user-model';

export default class Story extends Model {
  id!: number;

  title!: string;

  url?: string;

  body?: string;

  authorId!: number;

  author!: User;

  thread!: Comment;

  static get tableName(): string {
    return 'stories';
  }

  static get jsonSchema(): JSONSchema {
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
        body: { type: 'string', maxLength: 4000 },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
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
          to: 'comments.storyId',
          from: 'stories.id',
        },
      },
    };
  }
}
