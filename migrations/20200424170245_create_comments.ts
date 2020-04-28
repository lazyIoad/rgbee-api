import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createCommentsTableQuery = `CREATE TABLE comments (
    id               BIGSERIAL PRIMARY KEY NOT NULL,
    parent_id        BIGINT,
    text             TEXT,
    upvotes          INTEGER NOT NULL DEFAULT 0 CHECK (upvotes >= 0),
    downvotes        INTEGER NOT NULL DEFAULT 0 CHECK (downvotes >= 0),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  return knex.raw(createCommentsTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropCommentsTableQuery = `DROP TABLE comments`;
  return knex.raw(dropCommentsTableQuery);
}
