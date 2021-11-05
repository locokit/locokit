import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('block', table => {
      table.boolean('elevation').defaultTo(false)
    })
    .alterTable('container', table => {
      table.boolean('elevation').defaultTo(false)
    })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('block', table => {
      table.dropColumn('elevation')
    })
    .alterTable('container', table => {
      table.dropColumn('elevation')
    })
}

