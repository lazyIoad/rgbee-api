import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const addCommentsRelationsQuery = `ALTER TABLE comments
    ADD COLUMN author_id  BIGINT REFERENCES users(id),
    ADD COLUMN story_id   BIGINT REFERENCES stories(id)
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
