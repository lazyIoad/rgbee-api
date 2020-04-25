import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createUsersTableQuery = `CREATE TABLE users (
    id               BIGSERIAL PRIMARY KEY NOT NULL,
    email            TEXT UNIQUE NOT NULL CHECK (CHAR_LENGTH(email) <= 200),
    username         TEXT UNIQUE NOT NULL CHECK (CHAR_LENGTH(username) <= 20),
    password         TEXT NOT NULL,
    about            TEXT CHECK (CHAR_LENGTH(about) <= 400),
    submission_karma INTEGER DEFAULT 0 CHECK (submission_karma >= 0),
    comment_karma    INTEGER DEFAULT 0 CHECK (comment_karma >= 0),
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
  )`;

  return knex.raw(createUsersTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropUsersTableQuery = `DROP TABLE users`;
  return knex.raw(dropUsersTableQuery);
}
