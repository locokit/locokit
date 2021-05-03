import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('attachment', table => {
      table.increments('id')
      table.string('filepath')
      table.string('filename').notNullable()
      table.string('mime')
      table.string('ext')
      table.integer('size')
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
      table.uuid('workspace_id').unsigned().notNullable()
      table.foreign('workspace_id', 'FK_attachment_workspace_id').references('id').inTable('workspace')
    })
    .createTable('row_has_attachment', table => {
      table.increments('id')
      table.uuid('table_row_id').unsigned()
      table.foreign('table_row_id', 'FK_rha_table_row_id').references('id').inTable('table_row')
      table.integer('attachment_id')
      table.foreign('attachment_id', 'FK_rha_attachment_id').references('id').inTable('attachment')
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('row_has_attachment')
    .dropTableIfExists('attachment')
}
