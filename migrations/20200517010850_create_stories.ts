import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createStoriesTableQuery = `CREATE TABLE stories (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title        TEXT NOT NULL CHECK (CHAR_LENGTH(title) <= 100),
    url          TEXT CHECK (CHAR_LENGTH(url) <= 2000),
    body         TEXT,
    author_id    INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
  ) INHERITS (entities)`;

  return knex.raw(createStoriesTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropStoriesTableQuery = `DROP TABLE stories`;
  return knex.raw(dropStoriesTableQuery);
}
