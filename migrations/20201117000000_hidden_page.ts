import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('page', table => {
      table.boolean('hidden')
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('page', table => {
      table.dropColumn('hidden')
    })
}
