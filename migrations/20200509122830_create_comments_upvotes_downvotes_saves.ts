import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createTablesQuery = `CREATE TABLE comments_upvotes (
    user_id    BIGINT REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment_id BIGINT REFERENCES comments(id) ON UPDATE CASCADE,
               PRIMARY KEY (user_id, comment_id)
  );

  CREATE TABLE comments_downvotes (
    user_id    BIGINT REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment_id BIGINT REFERENCES comments(id) ON UPDATE CASCADE,
               PRIMARY KEY (user_id, comment_id)
  );

  CREATE TABLE comments_saves (
    user_id    BIGINT REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment_id BIGINT REFERENCES comments(id) ON UPDATE CASCADE,
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
