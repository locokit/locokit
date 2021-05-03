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
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('attachment')
}
