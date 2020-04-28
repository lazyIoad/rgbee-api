import { Model } from 'objection';

export default class Comment extends Model {
  id!: number;

  text?: string;

  static get tableName(): string {
    return 'comments';
  }

  static get jsonSchema(): object {
    return {
      type: 'object',

      properties: {
        text: { type: 'string', maxLength: 4000 },
      },
    };
  }
}
