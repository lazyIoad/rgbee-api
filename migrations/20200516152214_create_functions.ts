import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createFunctionsQuery = `
  CREATE FUNCTION recentness(entity_stamp timestamp, sys_stamp timestamp) RETURNS integer AS $$
    SELECT (EXTRACT(EPOCH FROM sys_stamp) - (EXTRACT(EPOCH FROM entity_stamp)) / 3600)::integer
  $$ LANGUAGE SQL IMMUTABLE;

  CREATE FUNCTION popular_ranking(score integer, entity_stamp timestamp, sys_stamp timestamp, time_offset integer, gravity numeric) RETURNS numeric AS $$
    SELECT score / (recentness(entity_stamp, sys_stamp) + time_offset) ^ gravity
  $$ LANGUAGE SQL IMMUTABLE;`;

  return knex.raw(createFunctionsQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropFunctionsQuery = `
    DROP FUNCTION recentness(timestamp, timestamp);
    DROP FUNCTION popular_ranking(integer, timestamp, timestamp, integer, numeric);
  `;

  return knex.raw(dropFunctionsQuery);
}
