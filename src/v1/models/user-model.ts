import argon2 from 'argon2';
import {
  Model,
  RelationMappings,
  Modifiers,
  AnyQueryBuilder,
  Validator,
  QueryContext,
  DataError,
} from 'objection';
// eslint-disable-next-line import/no-cycle
import Comment from './comment-model';
// eslint-disable-next-line import/no-cycle
import Story from './story-model';
import UserValidator from '../validators/user-validator';

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

  async $beforeInsert(queryContext: QueryContext): Promise<void> {
    await super.$beforeInsert(queryContext);
    this.password = await argon2.hash(this.password, { type: argon2.argon2i });
  }

  static get tableName(): string {
    return 'users';
  }

  static createValidator(): Validator {
    return new UserValidator();
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

  static get modifiers(): Modifiers {
    return {
      selectDefaultFields(builder: AnyQueryBuilder): void {
        builder
          .select('username', 'about', 'submissionKarma', 'commentKarma', 'createdAt')
          .catch((err) => {
            throw new DataError(err);
          });
      },

      selectSelfFields(builder: AnyQueryBuilder): void {
        builder
          .select('username', 'email', 'about', 'submissionKarma', 'commentKarma', 'createdAt')
          .catch((err) => {
            throw new DataError(err);
          });
      },
    };
  }
}
