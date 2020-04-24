import { Model } from 'objection';

export default class User extends Model {
  static get tableName(): string {
    return 'users';
  }

  static get jsonSchema(): object {
    return {
      type: 'object',
      required: ['email', 'username', 'password'],

      properties: {
        id: { type: 'integer' },
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
}
