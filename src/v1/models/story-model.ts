import {
  Model,
  RelationMappings,
  Modifiers,
  AnyQueryBuilder,
  DataError,
  Validator,
} from 'objection';
// eslint-disable-next-line import/no-cycle
import Comment from './comment-model';
// eslint-disable-next-line import/no-cycle
import User from './user-model';
import StoryValidator from '../validators/story-validator';

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

  static createValidator(): Validator {
    return new StoryValidator();
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

  static get modifiers(): Modifiers {
    return {
      orderByNew(builder: AnyQueryBuilder): void {
        builder.orderByRaw('created_at DESC').catch((err) => {
          throw new DataError(err);
        });
      },

      orderByPopularity(builder: AnyQueryBuilder): void {
        builder
          .orderByRaw(
            'popular_ranking(greatest(num_upvotes - num_downvotes, 0), created_at::timestamp, now()::timestamp, 2, 1.8) DESC, created_at DESC',
          )
          .catch((err) => {
            throw new DataError(err);
          });
      },

      selectDefaultFields(builder: AnyQueryBuilder): void {
        builder.select('title', 'url', 'body', 'createdAt').catch((err) => {
          throw new DataError(err);
        });
      },

      selectListFields(builder: AnyQueryBuilder): void {
        builder.select('title', 'url', 'body', 'numComments', 'createdAt').catch((err) => {
          throw new DataError(err);
        });
      },
    };
  }
}
