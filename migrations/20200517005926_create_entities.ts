import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createEntitiesTableQuery = `CREATE TABLE entities (
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
  )`;

  return knex.raw(createEntitiesTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropEntitiesTableQuery = `DROP TABLE entities`;
  return knex.raw(dropEntitiesTableQuery);
}
