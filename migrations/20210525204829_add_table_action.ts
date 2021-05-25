import * as Knex from "knex";
import { COLUMN_TYPE } from '@locokit/lck-glossary'


export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable('table_action', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('label').notNullable()
      table.enum('class_button', ['danger', 'warning', 'success', 'primary', 'secondary']).notNullable().defaultTo('primary')
      table.string('icon')
      table.enum('action', ['page_detail_to', 'process_trigger']).notNullable().defaultTo('page_detail_to')
      table.uuid('page_detail_id')
      table.uuid('display_field_id')
      table.jsonb('display_field_condition_query')
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
      table.uuid('table_id').unsigned().notNullable()
      table.foreign('table_id', 'FK_action_table_id').references('id').inTable('table')
      table.uuid('process_id').unsigned()
      table.foreign('process_id', 'FK_action_process_id').references('id').inTable('process')
    })
    .createTable('table_view_has_table_action', table => {
      table.uuid('table_action_id')
      table.uuid('table_view_id')
      table.primary(['table_action_id', 'table_view_id'])
      table.foreign('table_action_id', 'FK_tvta_column_id').references('id').inTable('table_action')
      table.foreign('table_view_id', 'FK_tvta_view_id').references('id').inTable('table_view')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('table_view_has_table_action')
    .dropTableIfExists('table_action')
}
