import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('container', table => {
      table.boolean('displayed_in_navbar')
      table.string('anchor_label')
      table.string('anchor_icon')
      table.enum('anchor_icon_class', ['danger', 'success', 'warning', 'primary', 'secondary']).defaultTo("primary")
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('container', table => {
      table.dropColumn('displayed_in_navbar')
      table.dropColumn('anchor_label')
      table.dropColumn('anchor_icon')
      table.dropColumn('anchor_icon_class')
    })
}

