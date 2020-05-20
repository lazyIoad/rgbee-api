import {
  Model,
  AnyQueryBuilder,
  Modifiers,
  RelationMappings,
  DataError,
  Validator,
} from 'objection';
// eslint-disable-next-line import/no-cycle
import User from './user-model';
// eslint-disable-next-line import/no-cycle
import Story from './story-model';
import CommentValidator from '../validators/comment-validator';

export default class Comment extends Model {
  id!: number;

  body?: string;

  authorId!: number;

  author!: User;

  parentId!: number;

  parent!: Comment;

  storyId!: number;

  story!: Story;

  children: Comment[];

  static get tableName(): string {
    return 'comments';
  }

  static createValidator(): Validator {
    return new CommentValidator();
  }

  static get relationMappings(): RelationMappings {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'comments.authorId',
          to: 'users.id',
        },
      },
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Comment,
        join: {
          from: 'comments.parentId',
          to: 'comments.id',
        },
      },
      children: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'comments.id',
          to: 'comments.parentId',
        },
      },
      story: {
        relation: Model.BelongsToOneRelation,
        modelClass: Comment,
        join: {
          from: 'comments.storyId',
          to: 'stories.id',
        },
      },
    };
  }

  static get modifiers(): Modifiers {
    return {
      orderByKarma(builder: AnyQueryBuilder): void {
        builder
          .orderByRaw(
            'popular_ranking(greatest(num_upvotes - num_downvotes, 0), created_at::timestamp, now()::timestamp, 2, 1.8) DESC, created_at DESC',
          )
          .catch((err) => {
            throw new DataError(err);
          });
      },
    };
  }
}
