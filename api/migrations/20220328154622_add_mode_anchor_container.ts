import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
  .alterTable('page', table => {
    table.enum('modeNavigation', ['anchor', 'tab']).defaultTo('anchor').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
  .alterTable('page', table => {
    table.dropColumn('modeNavigation')
  })
}
