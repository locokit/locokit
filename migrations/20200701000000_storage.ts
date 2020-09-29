import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema
  .createTable('workspace', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
  })

  .createTable('chapter', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.uuid('workspace_id').unsigned()
    table.foreign('workspace_id', 'FK_db_workspace_id').references('id').inTable('workspace')
  })

  .createTable('page', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.uuid('chapter_id').unsigned()
    table.foreign('chapter_id', 'FK_page_chapter_id').references('id').inTable('chapter')
  })

  .createTable('container', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.jsonb('settings')
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.uuid('page_id').unsigned()
    table.foreign('page_id', 'FK_container_page_id').references('id').inTable('page')
  })

  .createTable('block', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title');
    table.enum('type', ['TableView', 'DetailView', 'Paragraph', 'Markdown', 'Heading', 'Media', 'KanbanView', 'GridView']);
    table.jsonb('settings')
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.uuid('container_id').unsigned()
    table.foreign('container_id', 'FK_block_container_id').references('id').inTable('container')
  })

  .createTable('group_has_workspace', function (table) {
    table.jsonb('permission').defaultTo([])
    table.uuid('group_id').unsigned()
    table.foreign('group_id', 'FK_group_id').references('id').inTable('group')
    table.uuid('workspace_id').unsigned()
    table.foreign('workspace_id', 'FK_workspace_id').references('id').inTable('workspace')
    table.primary(['workspace_id', 'group_id'])
    table.uuid('chapter_id').unsigned()
    table.foreign('chapter_id', 'FK_chapter_id').references('id').inTable('chapter')
    table.enum('role', ['OWNER', 'ADMIN', 'MEMBER']).notNullable().defaultTo('MEMBER');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
  })

  .createTable('database', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.uuid('workspace_id').unsigned()
    table.foreign('workspace_id', 'FK_db_workspace_id').references('id').inTable('workspace')
  })

  .createTable('table', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.uuid('database_id').unsigned()
    table.foreign('database_id', 'FK_table_database_id').references('id').inTable('database')
  })

  .createTable('table_relation', table => {
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.jsonb('settings')
    table.uuid('table_from_id').unsigned()
    table.foreign('table_from_id', 'FK_tr_table_from_id').references('id').inTable('table')
    table.uuid('table_to_id').unsigned()
    table.foreign('table_to_id', 'FK_tr_table_to_id').references('id').inTable('table')
    table.primary(['table_from_id', 'table_to_id'])
  })

  .createTable('column_type', table => {
    table.increments('id').primary();
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
  })

  .createTable('table_column', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.jsonb('settings')
    table.uuid('table_id').unsigned()
    table.foreign('table_id', 'FK_tc_table_id').references('id').inTable('table')
    table.integer('column_type_id').unsigned()
    table.foreign('column_type_id', 'FK_tc_column_type_id').references('id').inTable('column_type')
  })

  .createTable('table_column_relation', table => {
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.jsonb('settings')
    table.uuid('table_column_from_id').unsigned()
    table.foreign('table_column_from_id', 'FK_tcd_table_column_from_id').references('id').inTable('table_column')
    table.uuid('table_column_to_id').unsigned()
    table.foreign('table_column_to_id', 'FK_tcd_table_column_to_id').references('id').inTable('table_column')
    table.primary(['table_column_from_id', 'table_column_to_id'])
  })

  .createTable('table_row', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.jsonb('data')
    table.uuid('table_id').unsigned()
    table.foreign('table_id', 'FK_tr_table_id').references('id').inTable('table')
  })

  .createTable('table_row_relation', table => {
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.uuid('table_row_from_id').unsigned()
    table.foreign('table_row_from_id', 'FK_trr_table_row_from_id').references('id').inTable('table_row')
    table.uuid('table_row_to_id').unsigned()
    table.foreign('table_row_to_id', 'FK_trr_table_row_to_id').references('id').inTable('table_row')
    table.uuid('table_column_to_id').unsigned()
    table.foreign('table_column_to_id', 'FK_trr_table_column_to_id').references('id').inTable('table_column')
    table.primary(['table_row_to_id', 'table_column_to_id'])
  })

  .createTable('table_view', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.uuid('table_id').unsigned()
    table.foreign('table_id', 'FK_tv_table_id').references('id').inTable('table')
  })

  .createTable('table_view_has_table_column', table => {
    table.uuid('table_column_id')
    table.uuid('table_view_id')
    table.primary(['table_column_id', 'table_view_id'])
    table.foreign('table_column_id', 'FK_tvtc_column_id').references('id').inTable('table_column')
    table.foreign('table_view_id', 'FK_tvtc_view_id').references('id').inTable('table_view')
    table.integer('position')
    table.enum('order', ['ASC', 'DESC'])
    table.jsonb('filter')
    table.boolean('visible')
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
  })

}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
      .dropTableIfExists("table_row_relation")
      .dropTableIfExists("table_column_relation")
      .dropTableIfExists("table_relation")
      .dropTableIfExists("table_view_has_table_column")
      .dropTableIfExists("table_view")
      .dropTableIfExists("table_row")
      .dropTableIfExists("table_column")
      .dropTableIfExists("column_type")
      .dropTableIfExists("table")
      .dropTableIfExists("database")
      .dropTableIfExists("group_has_workspace")
      .dropTableIfExists("block")
      .dropTableIfExists("container")
      .dropTableIfExists("page")
      .dropTableIfExists("chapter")
      .dropTableIfExists("workspace");
}
