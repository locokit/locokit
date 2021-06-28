import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('block', table => {
      table.uuid('conditional_display_table_view_id')
      table.foreign('conditional_display_table_view_id', 'FK_block_conditional_display_table_view_id').references('id').inTable('table_view')
      table.uuid('conditional_display_field_id')
      table.foreign('conditional_display_field_id', 'FK_block_conditional_display_field_id').references('id').inTable('table_column')
      table.boolean('conditional_display_field_value').defaultTo(false)
      table.renameColumn('createdAt', 'created_at')
      table.renameColumn('updatedAt', 'updated_at')
    })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('block', table => {
      table.dropForeign(['conditional_display_table_view_id'], 'FK_block_conditional_display_table_view_id')
      table.dropColumn('conditional_display_table_view_id')
      table.dropForeign(['conditional_display_field_id'], 'FK_block_conditional_display_field_id')
      table.dropColumn('conditional_display_field_id')
      table.dropColumn('conditional_display_field_value')
      table.renameColumn('created_at', 'createdAt')
      table.renameColumn('updated_at', 'updatedAt')
    })

}
