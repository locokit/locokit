import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('attachment', table => {
      table.boolean('thumbnail').defaultTo(false)
      table.unique(['workspace_id', 'filename'])
    })
  }

  export async function down (knex: Knex): Promise<void> {
    return knex.schema
    .alterTable('attachment', table => {
      table.dropColumn('thumbnail')
      table.dropUnique(['workspace_id', 'filename'])
    })
}
