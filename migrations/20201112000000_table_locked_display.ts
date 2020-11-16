import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('table_view_has_table_column', table => {
      table.jsonb('display')
      table.renameColumn('order', 'sort')
    })
    .alterTable('table_view', table => {
      table.boolean('locked').defaultTo(false)
      table.integer('position')
    })
    .alterTable('table_column', table => {
      table.boolean('locked').defaultTo(false)
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('table_view_has_table_column', table => {
      table.renameColumn('sort', 'order')
      table.dropColumn('display')
    })
    .alterTable('table_view', table => {
      table.dropColumn('locked')
      table.dropColumn('position')
    })
    .alterTable('table_column', table => {
      table.dropColumn('locked')
    })
}
