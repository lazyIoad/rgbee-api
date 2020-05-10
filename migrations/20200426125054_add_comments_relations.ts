import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const addCommentsRelationsQuery = `ALTER TABLE comments
    ADD COLUMN author_id  BIGINT REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
    ADD COLUMN story_id   BIGINT REFERENCES stories(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
    ADD COLUMN parent_id  BIGINT REFERENCES comments(id) ON UPDATE CASCADE
  ;`;

  return knex.raw(addCommentsRelationsQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropCommentsRelationsQuery = `ALTER TABLE comments
    DROP COLUMN author_id,
    DROP COLUMN story_id
  ;`;

  return knex.raw(dropCommentsRelationsQuery);
}
