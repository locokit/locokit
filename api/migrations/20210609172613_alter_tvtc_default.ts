import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_view_has_table_column', table => {
      table.renameColumn('default', 'defaultString')
    })
    .alterTable('table_view_has_table_column', table => {
      table.jsonb('default')
    })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_view_has_table_column', table => {
      table.dropColumn('default')
    })
    .alterTable('table_view_has_table_column', table => {
      table.renameColumn('defaultString', 'default')
    })
}

