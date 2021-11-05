import * as Knex from "knex";

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('workspace', table => {
      table.string('documentation')
    })
    .alterTable('table_view', table => {
      table.string('documentation')
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema
  .alterTable('table_view', table => {
    table.dropColumn('documentation')
  })
  .alterTable('workspace', table => {
    table.dropColumn('documentation')
  })
}
