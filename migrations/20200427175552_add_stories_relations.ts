import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const addStoriesRelationsQuery = `ALTER TABLE stories
    ADD COLUMN author_id BIGINT REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
  ;`;

  return knex.raw(addStoriesRelationsQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropStoriesRelationsQuery = `ALTER TABLE stories
    DROP COLUMN author_id
  ;`;

  return knex.raw(dropStoriesRelationsQuery);
}
