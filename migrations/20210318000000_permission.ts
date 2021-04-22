import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  await knex.schema
    .createTable('group_acl_database', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('group_id').unsigned()
      table.foreign('group_id', 'FK_gad_group_id').references('id').inTable('group')
      table.uuid('database_id').unsigned()
      table.foreign('database_id', 'FK_gav_database_id').references('id').inTable('database')
      table.boolean('read').defaultTo(false)
      table.boolean('write').defaultTo(false)
      table.boolean('table_create').defaultTo(false)
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
    })
    .createTable('group_acl_table', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('group_id').unsigned()
      table.foreign('group_id', 'FK_gat_group_id').references('id').inTable('group')
      table.uuid('table_id').unsigned()
      table.foreign('table_id', 'FK_gav_table_id').references('id').inTable('table')
      table.boolean('create_rows').defaultTo(false)
      table.boolean('read_rows').defaultTo(false)
      table.boolean('update_rows').defaultTo(false)
      table.boolean('delete_rows').defaultTo(false)
      table.boolean('create_columns').defaultTo(false)
      table.boolean('read_columns').defaultTo(false)
      table.boolean('update_columns').defaultTo(false)
      table.boolean('delete_columns').defaultTo(false)
      table.boolean('create_views').defaultTo(false)
      table.boolean('read_views').defaultTo(false)
      table.boolean('update_views').defaultTo(false)
      table.boolean('delete_views').defaultTo(false)
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
    })
    .createTable('group_acl_column', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('group_id').unsigned()
      table.foreign('group_id', 'FK_gac_group_id').references('id').inTable('group')
      table.uuid('column_id').unsigned()
      table.foreign('column_id', 'FK_gav_column_id').references('id').inTable('table_column')
      table.boolean('read').defaultTo(false)
      table.boolean('write').defaultTo(false)
      table.jsonb('filter')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
    })
    .createTable('group_acl_view', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('group_id').unsigned()
      table.foreign('group_id', 'FK_gav_group_id').references('id').inTable('group')
      table.uuid('view_id').unsigned()
      table.foreign('view_id', 'FK_gav_view_id').references('id').inTable('table_view')
      table.boolean('read').defaultTo(false)
      table.boolean('write').defaultTo(false)
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
    })
    .alterTable('group', table => {
      table.boolean('is_manager')
      table.dropColumn('permission')
      table.dropColumn('workspace_role')
    })
}

export async function down (knex: Knex): Promise<any> {
  await knex.schema
    .dropTableIfExists('group_acl_view')
    .dropTableIfExists('group_acl_column')
    .dropTableIfExists('group_acl_table')
    .dropTableIfExists('group_acl_database')
    .alterTable('group', table => {
      table.dropColumn('is_manager')
      table.enum('workspace_role', ['OWNER', 'ADMIN', 'MEMBER']).notNullable().defaultTo('MEMBER')
      table.jsonb('permission').defaultTo([])
    })
}
