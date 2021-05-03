import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('container', table => {
      table.boolean('display_title')
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('container', table => {
      table.dropColumn('display_title')
    })
}

