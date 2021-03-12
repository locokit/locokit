import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('attachment', table => {
    table.increments('id')
    table.string('path')
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('attachment')
}
