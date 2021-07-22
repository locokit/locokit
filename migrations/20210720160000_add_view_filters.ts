import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('table_view', function (table) {
      table.jsonb('filters')
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('table_view', function (table) {
      table.dropColumn('filters')
    })
}
