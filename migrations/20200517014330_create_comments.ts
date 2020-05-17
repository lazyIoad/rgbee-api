import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createCommentsTableQuery = `CREATE TABLE comments (
    id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    body      TEXT,
    author_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    story_id  INTEGER NOT NULL REFERENCES stories(id) ON UPDATE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON UPDATE CASCADE
  ) INHERITS (entities, votables)`;

  return knex.raw(createCommentsTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropCommentsTableQuery = `DROP TABLE comments`;
  return knex.raw(dropCommentsTableQuery);
}
