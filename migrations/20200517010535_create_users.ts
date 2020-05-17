import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createUsersTableQuery = `CREATE TABLE users (
    id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email            TEXT UNIQUE NOT NULL CHECK (CHAR_LENGTH(email) <= 200),
    username         TEXT UNIQUE NOT NULL CHECK (CHAR_LENGTH(username) <= 20),
    password         TEXT NOT NULL,
    about            TEXT CHECK (CHAR_LENGTH(about) <= 400)
  ) INHERITS (entities)`;

  return knex.raw(createUsersTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropUsersTableQuery = `DROP TABLE users`;
  return knex.raw(dropUsersTableQuery);
}
