import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  await knex.schema
    .createTable('log', table => {
      table
        .increments('id')
        .primary()
      table
        .enum('event', [
          'ROW_CREATE',
          'ROW_PATCH',
          'ROW_REMOVE',
          'ROW_UPDATE',
        ])
        .notNullable()
      table
        .timestamp('createdAt')
        .defaultTo('now()')
      table
        .integer('user_id')
        .unsigned()
      table
        .foreign('user_id', 'FK_user_id')
        .references('id')
        .inTable('user')
        .onDelete('SET NULL')
      table
        .uuid('record_id')
        .unsigned()
      table
        .foreign('record_id', 'FK_record_id')
        .references('id')
        .inTable('table_row')
        .onDelete('SET NULL')
      table
        .uuid('field_id')
        .unsigned()
      table
        .foreign('field_id', 'FK_field_id')
        .references('id')
        .inTable('table_column')
        .onDelete('SET NULL')
      table
        .jsonb('from')
      table
        .jsonb('to')
      table
        .jsonb('deleted_references')
    })

    .alterTable('process_run', table => {
      table
        .integer('data_log_id')
        .unsigned()
      table
        .foreign('data_log_id')
        .references('id')
        .inTable('log')
        .onDelete('SET NULL')
    })
}

export async function down (knex: Knex): Promise<any> {
  await knex.schema
    .alterTable('process_run', table => {
      table
        .dropColumn('data_log_id')
    })

  await knex.schema
    .dropTableIfExists('log')
}
