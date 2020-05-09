import {
  Model,
  AnyQueryBuilder,
  Modifiers,
  JSONSchema,
  RelationMappings,
  ValidationError,
} from 'objection';
import User from './user-model';

export default class Comment extends Model {
  id!: number;

  text?: string;

  authorId!: number;

  author!: User;

  parentId!: number;

  parent!: Comment;

  storyId!: number;

  story!: './story-model';

  children: Comment[];

  static get tableName(): string {
    return 'comments';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',

      properties: {
        text: { type: 'string', maxLength: 4000 },
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
    if (this.parentId && (!this.text || this.text.length <= 0)) {
      throw new ValidationError({
        type: 'ModelValidation',
        data: {
          text: [
            {
              message: 'is a required property',
            },
          ],
        },
      });
    }
  }
}
