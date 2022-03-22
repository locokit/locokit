import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('workspace', table => {
      table.text('documentation').alter()
    })
    .alterTable('table', table => {
      table.text('documentation').alter()
    })
    .alterTable('table_column', table => {
      table.text('documentation').alter()
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('workspace', table => {
      table.string('documentation').alter()
    })
    .alterTable('table', table => {
      table.string('documentation').alter()
    })
    .alterTable('table_column', table => {
      table.string('documentation').alter()
    })
}
