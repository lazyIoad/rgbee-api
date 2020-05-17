import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createTablesQuery = `CREATE TABLE stories_upvotes (
    user_id  INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    story_id INTEGER NOT NULL REFERENCES stories(id) ON UPDATE CASCADE ON DELETE CASCADE,
             PRIMARY KEY (user_id, story_id)
  );

  CREATE TABLE stories_downvotes (
    user_id  INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    story_id INTEGER NOT NULL REFERENCES stories(id) ON UPDATE CASCADE ON DELETE CASCADE,
             PRIMARY KEY (user_id, story_id)
  );

  CREATE TABLE stories_saves (
    user_id  INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    story_id INTEGER NOT NULL REFERENCES stories(id) ON UPDATE CASCADE ON DELETE CASCADE,
             PRIMARY KEY (user_id, story_id)
  );`;

  return knex.raw(createTablesQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropTablesQuery = `
    DROP TABLE stories_upvotes;
    DROP TABLE stories_downvotes;
    DROP TABLE stories_saves;
  `;

  return knex.raw(dropTablesQuery);
}
