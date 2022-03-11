import * as Knex from 'knex'

/**
 * need add
 * ALTER TABLE public.table_row_relation DROP CONSTRAINT "FK_trr_table_row_to_id";
ALTER TABLE public.table_row_relation ADD CONSTRAINT "FK_trr_table_row_to_id" FOREIGN KEY (table_row_to_id) REFERENCES public.table_row(id) ON DELETE CASCADE;
ALTER TABLE public.table_column_relation DROP CONSTRAINT "FK_tcd_table_column_to_id";
ALTER TABLE public.table_column_relation ADD CONSTRAINT "FK_tcd_table_column_to_id" FOREIGN KEY (table_column_to_id) REFERENCES public.table_column(id) ON DELETE CASCADE;

 */

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('acl_column', table => {
      table.index('column_id')
      table.index('aclset_id')
    })
    .alterTable('acl_view', table => {
      table.index('view_id')
      table.index('aclset_id')
    })
    .alterTable('acl_database', table => {
      table.index('database_id')
      table.index('aclset_id')
    })
    .alterTable('acl_set', table => {
      table.index('chapter_id')
      table.index('workspace_id')
    })
    .alterTable('acl_table', table => {
      table.index('aclset_id')
      table.index('table_id')
    })

    .alterTable('table_column', table => {
      table.index('column_type_id')
    })
    .alterTable('table_view_has_table_column', table => {
      table.index('table_view_id')
    })
    .alterTable('table_column_relation', table => {
      table.dropForeign(['table_column_to_id'], 'FK_tcd_table_column_to_id')
      table.foreign('table_column_to_id', 'FK_tcd_table_column_to_id').references('id').inTable('table_column').onDelete('CASCADE')
      table.index('table_column_to_id')
    })
    .alterTable('table_row', table => {
      table.index('table_id')
    })
    .alterTable('table_row_relation', table => {
      table.dropForeign(['table_row_to_id'], 'FK_trr_table_row_to_id')
      table.foreign('table_row_to_id', 'FK_trr_table_row_to_id').references('id').inTable('table_row').onDelete('CASCADE')
      table.index('table_row_from_id')
      table.index('table_column_to_id')
    })
    .alterTable('table', table => {
      table.index('database_id')
    })
    .alterTable('table_view', table => {
      table.index('table_id')
    })
    .alterTable('table_view_has_table_action', table => {
      table.index('table_view_id')
    })
    .alterTable('table_action', table => {
      table.index('display_field_id')
      table.index('page_detail_id')
      table.index('page_query_field_id')
      table.index('page_redirect_id')
      table.index('process_id')
      table.index('table_id')
    })
    .alterTable('table_relation', table => {
      table.index('table_to_id')
    })

    .alterTable('log', table => {
      table.index('field_id')
      table.index('user_id')
      table.index('record_id')
    })

    .alterTable('database', table => {
      table.index('workspace_id')
    })

    .alterTable('group', table => {
      table.index('aclset_id')
    })
    .alterTable('user_has_group', table => {
      table.index('group_id')
    })

    .alterTable('page', table => {
      table.index('chapter_id')
    })
    .alterTable('chapter', table => {
      table.index('workspace_id')
    })
    .alterTable('container', table => {
      table.index('page_id')
    })
    .alterTable('block', table => {
      table.index('conditional_display_field_id')
      table.index('conditional_display_table_view_id')
      table.index('container_id')
    })

    .alterTable('process', table => {
      table.index('table_id')
    })
    .alterTable('process_run', table => {
      table.index('process_id')
      table.index('data_log_id')
      table.index('table_row_id')
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('acl_column', table => {
      table.dropIndex('column_id')
      table.dropIndex('aclset_id')
    })
    .alterTable('acl_view', table => {
      table.dropIndex('view_id')
      table.dropIndex('aclset_id')
    })
    .alterTable('acl_database', table => {
      table.dropIndex('database_id')
      table.dropIndex('aclset_id')
    })
    .alterTable('acl_set', table => {
      table.dropIndex('chapter_id')
      table.dropIndex('workspace_id')
    })
    .alterTable('acl_table', table => {
      table.dropIndex('aclset_id')
      table.dropIndex('table_id')
    })

    .alterTable('table_column', table => {
      table.dropIndex('column_type_id')
    })
    .alterTable('table_view_has_table_column', table => {
      table.dropIndex('table_view_id')
    })
    .alterTable('table_column_relation', table => {
      table.dropForeign(['table_column_to_id'], 'FK_tcd_table_column_to_id')
      table.foreign('table_column_to_id', 'FK_tcd_table_column_to_id').references('id').inTable('table_column')
      table.dropIndex('table_column_to_id')
    })
    .alterTable('table_row', table => {
      table.dropIndex('table_id')
    })
    .alterTable('table_row_relation', table => {
      table.dropForeign(['table_row_to_id'], 'FK_trr_table_row_to_id')
      table.foreign('table_row_to_id', 'FK_trr_table_row_to_id').references('id').inTable('table_row')
      table.dropIndex('table_row_from_id')
      table.dropIndex('table_column_to_id')
    })
    .alterTable('table', table => {
      table.dropIndex('database_id')
    })
    .alterTable('table_view', table => {
      table.dropIndex('table_id')
    })
    .alterTable('table_view_has_table_action', table => {
      table.dropIndex('table_view_id')
    })
    .alterTable('table_action', table => {
      table.dropIndex('display_field_id')
      table.dropIndex('page_detail_id')
      table.dropIndex('page_query_field_id')
      table.dropIndex('page_redirect_id')
      table.dropIndex('process_id')
      table.dropIndex('table_id')
    })
    .alterTable('table_relation', table => {
      table.dropIndex('table_to_id')
    })

    .alterTable('process_run', table => {
      table.dropIndex('table_row_id')
    })

    .alterTable('log', table => {
      table.dropIndex('field_id')
      table.dropIndex('user_id')
      table.dropIndex('record_id')
    })

    .alterTable('database', table => {
      table.dropIndex('workspace_id')
    })

    .alterTable('group', table => {
      table.dropIndex('aclset_id')
    })
    .alterTable('user_has_group', table => {
      table.dropIndex('group_id')
    })

    .alterTable('page', table => {
      table.dropIndex('chapter_id')
    })
    .alterTable('chapter', table => {
      table.dropIndex('workspace_id')
    })
    .alterTable('container', table => {
      table.dropIndex('page_id')
    })
    .alterTable('block', table => {
      table.dropIndex('conditional_display_field_id')
      table.dropIndex('conditional_display_table_view_id')
      table.dropIndex('container_id')
    })

    .alterTable('process', table => {
      table.dropIndex('table_id')
    })
    .alterTable('process_run', table => {
      table.dropIndex('process_id')
      table.dropIndex('data_log_id')
      table.dropIndex('table_row_id')
    })
}
