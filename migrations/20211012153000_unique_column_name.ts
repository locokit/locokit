import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('table_column', table => {
      table.unique(['table_id', 'text'])
    })
  }

export async function down (knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('table_column', table => {
      table.dropUnique(['table_id', 'text'])
    })
}
