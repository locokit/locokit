import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_column', table => {
      table.jsonb('validation')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_column', table => {
      table.dropColumn('validation')
    })
}

