import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  const createPopularityRankerQuery = `
    CREATE FUNCTION story_num_upvotes(id integer) RETURNS bigint AS $$
      SELECT COUNT (story_id) FROM stories_upvotes WHERE id = story_id
    $$ LANGUAGE SQL STABLE;

    CREATE FUNCTION story_num_downvotes(id integer) RETURNS bigint AS $$
      SELECT COUNT (story_id) FROM stories_downvotes WHERE id = story_id
    $$ LANGUAGE SQL STABLE;

    CREATE FUNCTION story_score(id integer) RETURNS bigint AS $$
      SELECT story_num_upvotes(id) - story_num_downvotes(id)
    $$ LANGUAGE SQL STABLE;

    CREATE FUNCTION recentness(entity_stamp timestamp, sys_stamp timestamp) RETURNS integer AS $$
      SELECT (EXTRACT(EPOCH FROM sys_stamp) - (EXTRACT(EPOCH FROM entity_stamp)) / 3600)::integer
    $$ LANGUAGE SQL IMMUTABLE;

    CREATE FUNCTION story_popularity(id integer, story_created_at timestamp, sys_stamp timestamp, time_offset integer, gravity numeric) RETURNS numeric AS $$
      SELECT greatest(story_score(id), 0) / (recentness(story_created_at, sys_stamp) + time_offset) ^ gravity
    $$ LANGUAGE SQL STABLE;

    CREATE FUNCTION story_num_comments(id integer) RETURNS bigint AS $$
      SELECT COUNT (story_id) FROM comments WHERE id = story_id
    $$ LANGUAGE SQL STABLE;
  `;

  return knex.raw(createPopularityRankerQuery);
}

export async function down(knex: Knex): Promise<void> {
  const dropPopularityRankerQuery = `
    DROP FUNCTION story_num_upvotes(integer);
    DROP FUNCTION story_num_downvotes(integer);
    DROP FUNCTION story_score(integer);
    DROP FUNCTION recentness(timestamp, timestamp);
    DROP FUNCTION story_popularity(integer, timestamp, timestamp, integer, numeric);
    DROP FUNCTION story_num_comments(id integer);
  `;

  return knex.raw(dropPopularityRankerQuery);
}
