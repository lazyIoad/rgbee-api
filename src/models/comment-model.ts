import {
  Model,
  AnyQueryBuilder,
  Modifiers,
  JSONSchema,
  RelationMappings,
  ValidationError,
} from 'objection';
// eslint-disable-next-line import/no-cycle
import User from './user-model';
// eslint-disable-next-line import/no-cycle
import Story from './story-model';

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

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',

      properties: {
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
        builder.orderByRaw('num_upvotes + num_downvotes DESC, created_at DESC');
      },
    };
  }

  $beforeInsert(): void {
    // Validate body length if this comment isn't a story-thread.
    if (this.parentId && (!this.body || this.body.length <= 0)) {
      throw new ValidationError({
        type: 'ModelValidation',
        data: {
          body: [
            {
              message: 'is a required property',
            },
          ],
        },
      });
    }
  }
}
