import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createCommentsTableQuery = `CREATE TABLE comments (
    id               BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    body             TEXT,
    num_upvotes      INTEGER NOT NULL DEFAULT 0 CHECK (num_upvotes >= 0),
    num_downvotes    INTEGER NOT NULL DEFAULT 0 CHECK (num_downvotes >= 0),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  return knex.raw(createCommentsTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropCommentsTableQuery = `DROP TABLE comments`;
  return knex.raw(dropCommentsTableQuery);
}
