import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createStoriesTableQuery = `CREATE TABLE stories (
    id               BIGSERIAL PRIMARY KEY NOT NULL,
    title            TEXT NOT NULL CHECK (CHAR_LENGTH(title) <= 100),
    url              TEXT CHECK (CHAR_LENGTH(url) <= 2000),
    text             TEXT NOT NULL,
    upvotes          INTEGER DEFAULT 0 CHECK (upvotes >= 0),
    downvotes        INTEGER DEFAULT 0 CHECK (downvotes >= 0),
    num_comments     INTEGER DEFAULT 0 CHECK (num_comments >= 0),
    thread           BIGINT REFERENCES comments(id),
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
  )`;

  return knex.raw(createStoriesTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropStoriesTableQuery = `DROP TABLE stories`;
  return knex.raw(dropStoriesTableQuery);
}
