import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema
  .alterTable('table_action', table => {
    table.string('type_page_to')
    table.string('notification_success_title')
    table.string('notification_success_description')
    table.string('notification_error_title')
    table.string('notification_error_description')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
  .alterTable('table_action', table => {
    table.dropColumn('type_page_to')
    table.dropColumn('notification_success_title')
    table.dropColumn('notification_success_description')
    table.dropColumn('notification_error_title')
    table.dropColumn('notification_error_description')
  })
}

