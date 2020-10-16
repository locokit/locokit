import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('page', function (table) {
      table.integer('position')
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('page', function (table) {
      table.dropColumn('position')
    })
}
