import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_view_has_table_column', table => {
      table.boolean('transmitted').defaultTo(true)
      table.string('default')
      table.renameColumn('display', 'style')
      table.renameColumn('visible', 'displayed')
      table.dropColumn('sort')
    })
  await knex.table('table_view_has_table_column').update('transmitted', knex.ref('displayed'))
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_view_has_table_column', table => {
      table.dropColumn('default')
      table.dropColumn('transmitted')
      table.enum('sort', ['ASC', 'DESC'])
      table.renameColumn('displayed', 'visible')
      table.renameColumn('style', 'display')
    })
}

