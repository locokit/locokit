import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  await knex.schema
    .createTable('log', table => {
      table
        .bigIncrements('id')
        .primary()
      table
        .enum('event', [
          'RECORD_CREATE',
          'RECORD_PATCH',
          'RECORD_REMOVE',
          'RECORD_UPDATE',
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
        .onDelete('CASCADE')
      table
        .uuid('field_id')
        .unsigned()
      table
        .foreign('field_id', 'FK_field_id')
        .references('id')
        .inTable('table_column')
        .onDelete('CASCADE')
      table
        .jsonb('from')
      table
        .string('deleted_user', 255)
    })

    .alterTable('process_run', table => {
      table
        .bigInteger('data_log_id')
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
