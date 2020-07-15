import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex
    .raw('create extension if not exists "uuid-ossp"')
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
      .raw('drop extension if exists "uuid-ossp"');
}
