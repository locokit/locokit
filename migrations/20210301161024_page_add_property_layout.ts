import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('page', table => {
      table.enum('layout', ['classic', 'center', 'flex', 'full']).defaultTo('classic')
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('page', table => {
      table.dropColumn('layout')
    })
}
