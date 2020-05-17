import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createTablesQuery = `CREATE TABLE comments_upvotes (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
               PRIMARY KEY (user_id, comment_id)
  );

  CREATE TABLE comments_downvotes (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
               PRIMARY KEY (user_id, comment_id)
  );

  CREATE TABLE comments_saves (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
               PRIMARY KEY (user_id, comment_id)
  );`;

  return knex.raw(createTablesQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropTablesQuery = `
    DROP TABLE comments_upvotes;
    DROP TABLE comments_downvotes;
    DROP TABLE comments_saves;
  `;

  return knex.raw(dropTablesQuery);
}
