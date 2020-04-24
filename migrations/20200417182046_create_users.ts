import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createUsersTableQuery = `CREATE TABLE users (
    id         SERIAL PRIMARY KEY NOT NULL,
    email      TEXT UNIQUE NOT NULL CHECK (CHAR_LENGTH(email) <= 200),
    password   TEXT NOT NULL,
    name       TEXT CHECK (CHAR_LENGTH(name) <= 40),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  return knex.raw(createUsersTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropUsersTableQuery = `DROP TABLE users`;
  return knex.raw(dropUsersTableQuery);
}
