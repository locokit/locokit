import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema
  .createTable('workspace', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
  })

  .createTable('chapter', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.integer('workspace_id').unsigned()
    table.foreign('workspace_id', 'FK_db_workspace_id').references('id').inTable('workspace')
  })

  .createTable('page', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.integer('chapter_id').unsigned()
    table.foreign('chapter_id', 'FK_page_chapter_id').references('id').inTable('chapter')
  })

  .createTable('block', table => {
    table.increments('id');
    table.string('text');
    table.enum('type', ['TableView', 'Text']);
    table.jsonb('settings')
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.integer('page_id').unsigned()
    table.foreign('page_id', 'FK_block_page_id').references('id').inTable('page')
  })

  .createTable('group_has_workspace', function (table) {
    table.jsonb('permission').defaultTo([])
    table.integer('group_id').unsigned()
    table.foreign('group_id', 'FK_group_id').references('id').inTable('group')
    table.integer('workspace_id').unsigned()
    table.foreign('workspace_id', 'FK_workspace_id').references('id').inTable('workspace')
    table.primary(['workspace_id', 'group_id'])
    table.integer('chapter_id').unsigned()
    table.foreign('chapter_id', 'FK_chapter_id').references('id').inTable('chapter')
    table.enum('role', ['OWNER', 'ADMIN', 'MEMBER']).notNullable().defaultTo('MEMBER');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
  })

  .createTable('database', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.integer('workspace_id').unsigned()
    table.foreign('workspace_id', 'FK_db_workspace_id').references('id').inTable('workspace')
  })

  .createTable('table', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.integer('database_id').unsigned()
    table.foreign('database_id', 'FK_table_database_id').references('id').inTable('database')
  })

  .createTable('column_type', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
  })

  .createTable('table_column', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.jsonb('settings')
    table.integer('table_id').unsigned()
    table.foreign('table_id', 'FK_tc_table_id').references('id').inTable('table')
    table.integer('column_type_id').unsigned()
    table.foreign('column_type_id', 'FK_tc_column_type_id').references('id').inTable('column_type')
  })

  .createTable('table_row', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.jsonb('data')
    table.integer('table_id').unsigned()
    table.foreign('table_id', 'FK_tr_table_id').references('id').inTable('table')
  })

  .createTable('table_view', table => {
    table.increments('id');
    table.string('text');
    table.timestamp('createdAt').defaultTo('now()');
    table.timestamp('updatedAt').defaultTo('now()');
    table.integer('table_id').unsigned()
    table.foreign('table_id', 'FK_tv_table_id').references('id').inTable('table')
  })

  .createTable('table_view_has_table_column', table => {
    table.integer('table_column_id').unsigned()
    table.integer('table_view_id').unsigned()
    table.primary(['table_column_id', 'table_view_id'])
    table.foreign('table_column_id', 'FK_tvtc_column_id').references('id').inTable('table_column')
    table.foreign('table_view_id', 'FK_tvtc_view_id').references('id').inTable('table_view')
    table.integer('order')
    table.jsonb('filter')
  })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
      .dropTable("table_view_has_table_column")
      .dropTable("table_view")
      .dropTable("table_row")
      .dropTable("table_column")
      .dropTable("column_type")
      .dropTable("table")
      .dropTable("database")
      .dropTable("group_has_workspace")
      .dropTable("block")
      .dropTable("page")
      .dropTable("chapter")
      .dropTable("workspace");
}
