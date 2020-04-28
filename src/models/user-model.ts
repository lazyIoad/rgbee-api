import argon2 from 'argon2';
import { Model } from 'objection';

export default class User extends Model {
  id!: number;

  email!: string;

  username!: string;

  password!: string;

  about?: string;

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

  static get jsonSchema(): object {
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
}
