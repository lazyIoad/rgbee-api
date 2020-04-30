import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createStoriesTableQuery = `CREATE TABLE stories (
    id               BIGSERIAL PRIMARY KEY NOT NULL,
    title            TEXT NOT NULL CHECK (CHAR_LENGTH(title) <= 100),
    url              TEXT CHECK (CHAR_LENGTH(url) <= 2000),
    text             TEXT,
    num_upvotes      INTEGER NOT NULL DEFAULT 0 CHECK (num_upvotes >= 0),
    num_downvotes    INTEGER NOT NULL DEFAULT 0 CHECK (num_downvotes >= 0),
    num_comments     INTEGER NOT NULL DEFAULT 0 CHECK (num_comments >= 0),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  return knex.raw(createStoriesTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropStoriesTableQuery = `DROP TABLE stories`;
  return knex.raw(dropStoriesTableQuery);
}
