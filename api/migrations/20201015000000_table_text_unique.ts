import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.alterTable('table', table => {
    table.unique(['text', 'database_id'])
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.alterTable('table', table => {
    table.dropUnique(['text', 'database_id'])
  })
}
