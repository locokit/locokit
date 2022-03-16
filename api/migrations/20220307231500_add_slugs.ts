import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('workspace', table => {
      table.string('slug', 255)
      table.unique(['slug'])
    })
    .alterTable('database', table => {
      table.string('slug', 255)
      table.unique(['slug', 'workspace_id'])
    })
    .alterTable('table', table => {
      table.string('slug', 255)
      table.unique(['slug', 'database_id'])
    })
    .alterTable('table_column', table => {
      table.string('slug', 255)
      table.unique(['slug', 'table_id'])
    })
    .alterTable('table_view', table => {
      table.string('slug', 255)
      table.unique(['slug', 'table_id'])
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('workspace', table => {
      table.dropUnique(['slug'])
      table.dropColumn('slug')
    })
    .alterTable('database', table => {
      table.dropUnique(['slug', 'workspace_id'])
      table.dropColumn('slug')
    })
    .alterTable('table', table => {
      table.dropUnique(['slug', 'database_id'])
      table.dropColumn('slug')
    })
    .alterTable('table_column', table => {
      table.dropUnique(['slug', 'table_id'])
      table.dropColumn('slug')
    })
    .alterTable('table_view', table => {
      table.dropUnique(['slug', 'table_id'])
      table.dropColumn('slug')
    })
}
