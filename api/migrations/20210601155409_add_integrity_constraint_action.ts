import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_action', table => {
      table.uuid('page_redirect_id')
      table.foreign('page_detail_id', 'FK_action_page_detail_id_id').references('id').inTable('page')
      table.foreign('page_redirect_id', 'FK_action_page_redirect_id').references('id').inTable('page')
      table.foreign('page_query_field_id', 'FK_action_page_query_field_id').references('id').inTable('table_column')
      table.foreign('display_field_id', 'FK_action_display_field_id').references('id').inTable('table_column')
    })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('table_action', table => {
      table.dropForeign(['page_detail_id'], 'FK_action_page_detail_id_id')
      table.dropForeign(['page_redirect_id'], 'FK_action_page_redirect_id')
      table.dropForeign(['page_query_field_id'], 'FK_action_page_query_field_id')
      table.dropForeign(['display_field_id'], 'FK_action_display_field_id')
      table.dropColumn('page_redirect_id')
    })
}

