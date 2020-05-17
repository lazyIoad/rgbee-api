import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createVotablesTableQuery = `CREATE TABLE votables (
    num_upvotes   INTEGER NOT NULL DEFAULT 0 CHECK (num_upvotes >= 0),
    num_downvotes INTEGER NOT NULL DEFAULT 0 CHECK (num_downvotes >= 0),
  )`;

  return knex.raw(createVotablesTableQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropVotablesTableQuery = `DROP TABLE votables`;
  return knex.raw(dropVotablesTableQuery);
}
