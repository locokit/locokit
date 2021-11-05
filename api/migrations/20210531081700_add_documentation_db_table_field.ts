import * as Knex from "knex";

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table', table => {
      table.string('documentation')
    })
    .alterTable('database', table => {
      table.string('documentation')
    })
    .alterTable('table_column', table => {
      table.string('documentation')
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema
  .alterTable('table', table => {
    table.dropColumn('documentation')
  })
  .alterTable('database', table => {
    table.dropColumn('documentation')
  })
  .alterTable('table_column', table => {
    table.dropColumn('documentation')
  })
}
