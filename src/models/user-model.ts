import { Model } from 'objection';

export default class User extends Model {
  static get tableName(): string {
    return 'users';
  }

  static get jsonSchema(): object {
    return {
      type: 'object',
      required: ['email', 'password'],

      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email', maxLength: 200 },
        name: { type: 'string', maxLength: 40 },
      },
    };
  }
}
