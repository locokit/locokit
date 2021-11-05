import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .createTable('process', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('text')
      table.string('url')
      table.jsonb('settings')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.uuid('workspace_id').unsigned()
      table.foreign('workspace_id', 'FK_process_workspace_id').references('id').inTable('workspace')
    })

    .createTable('process_trigger', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('text')
      table.boolean('automatic').defaultTo(false)
      table.jsonb('settings')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.uuid('process_id').unsigned().notNullable()
      table.foreign('process_id', 'FK_pt_process_id').references('id').inTable('process')
      table.uuid('table_id').unsigned()
      table.foreign('table_id', 'FK_pt_table_id').references('id').inTable('table')
    })

    .createTable('process_execution', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('text')
      table.timestamp('when')
      table.enum('result', ['SUCCESS', 'ERROR', 'WARNING'])
      table.integer('duration')
      table.text('log')
      table.jsonb('settings')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.uuid('process_trigger_id').unsigned().notNullable()
      table.foreign('process_trigger_id', 'FK_pe_pt_id').references('id').inTable('process_trigger')
      table.uuid('table_row_id').unsigned()
      table.foreign('table_row_id', 'FK_pe_table_row_id').references('id').inTable('table_row')
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('process_execution')
    .dropTableIfExists('process_trigger')
    .dropTableIfExists('process')
}
