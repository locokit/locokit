import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_view_has_table_column', table => {
      table.jsonb('display_conditions')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_view_has_table_column', table => {
      table.dropColumn('display_conditions')
    })
}

