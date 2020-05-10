import argon2 from 'argon2';
import { Model, JSONSchema, RelationMappings } from 'objection';
// eslint-disable-next-line import/no-cycle
import Comment from './comment-model';
// eslint-disable-next-line import/no-cycle
import Story from './story-model';

export default class User extends Model {
  id!: number;

  email!: string;

  username!: string;

  password!: string;

  about?: string;

  upvotedStories!: Story[];

  downvotedStories!: Story[];

  savedStories!: Story[];

  upvotedComments!: Comment[];

  downvotedComments!: Comment[];

  savedComments!: Comment[];

  async validatePassword(password: string): Promise<boolean> {
    return argon2.verify(this.password, password, {
      type: argon2.argon2i,
    });
  }

  static async generatePasswordHash(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2i });
  }

  static get tableName(): string {
    return 'users';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['email', 'username', 'password'],

      properties: {
        email: { type: 'string', format: 'email', maxLength: 200 },
        username: {
          type: 'string',
          minLength: 1,
          maxLength: 20,
          pattern: '[a-zA-Z_][a-zA-Z0-9_]*',
        },
        about: { type: 'string', maxLength: 400 },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      upvotedStories: {
        relation: Model.ManyToManyRelation,
        modelClass: Story,
        join: {
          from: 'users.id',
          through: {
            from: 'stories_upvotes.userId',
            to: 'stories_upvotes.storyId',
          },
          to: 'stories.id',
        },
      },
      downvotedStories: {
        relation: Model.ManyToManyRelation,
        modelClass: Story,
        join: {
          from: 'users.id',
          through: {
            from: 'stories_downvotes.userId',
            to: 'stories_downvotes.storyId',
          },
          to: 'stories.id',
        },
      },
      savedStories: {
        relation: Model.ManyToManyRelation,
        modelClass: Story,
        join: {
          from: 'users.id',
          through: {
            from: 'stories_saves.userId',
            to: 'stories_saves.storyId',
          },
          to: 'stories.id',
        },
      },
      upvotedComments: {
        relation: Model.ManyToManyRelation,
        modelClass: Comment,
        join: {
          from: 'users.id',
          through: {
            from: 'comments_upvotes.userId',
            to: 'comments_upvotes.commentId',
          },
          to: 'comments.id',
        },
      },
      downvotedComments: {
        relation: Model.ManyToManyRelation,
        modelClass: Comment,
        join: {
          from: 'users.id',
          through: {
            from: 'comments_downvotes.userId',
            to: 'comments_downvotes.commentId',
          },
          to: 'comments.id',
        },
      },
      savedComments: {
        relation: Model.ManyToManyRelation,
        modelClass: Comment,
        join: {
          from: 'users.id',
          through: {
            from: 'comments_saves.userId',
            to: 'comments_saves.commentId',
          },
          to: 'comments.id',
        },
      },
    };
  }
}
