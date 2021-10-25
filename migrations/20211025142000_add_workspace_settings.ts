import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('workspace', table => {
      table.jsonb('settings')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('workspace', table => {
      table.dropColumn('settings')
    })
}
