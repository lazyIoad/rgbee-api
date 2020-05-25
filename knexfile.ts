import { knexSnakeCaseMappers } from 'objection';

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'rgbee',
      user: 'areeb',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    ...knexSnakeCaseMappers(),
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'rgbee',
      user: 'areeb',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    ...knexSnakeCaseMappers(),
  },
};
