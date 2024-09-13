import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  await knex.schema
    .raw('create extension if not exists "uuid-ossp"')
    .raw('create extension if not exists "postgis"')
    .raw('create extension if not exists "unaccent"')
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .raw('drop extension if exists "uuid-ossp"')
    .raw('drop extension if exists "postgis"')
    .raw('drop extension if exists "unaccent"')
}
