import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  await knex.schema
    .alterTable('process_trigger', table => {
      table.dropColumn('process_id')
      table.integer('maximumNumberSuccess')
      table.string('url')
      table.renameColumn('event', 'trigger')
    })
    .dropTable('process')
    .alterTable('process_execution', table => {
      table.renameColumn('process_trigger_id', 'process_id')
    })
    .renameTable('process_trigger', 'process')
  await knex.schema.renameTable('process_execution', 'process_run')
}

export async function down (knex: Knex): Promise<any> {
  await knex.schema.renameTable('process_run', 'process_execution')
  await knex.schema.renameTable('process', 'process_trigger')
  await knex.schema
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
    .alterTable('process_trigger', table => {
      table.renameColumn('trigger', 'event')
      table.dropColumn('maximumNumberSuccess')
      table.dropColumn('url')
      table.uuid('process_id').unsigned()
    })
    .alterTable('process_execution', table => {
      table.renameColumn('process_id', 'process_trigger_id')
    })
  const defaultWorkspace = await knex.table('workspace').returning('id').insert({
    text: 'default workspace for rollback of process updates v2'
  })
  const defaultProcess = await knex.table('process').returning('id').insert({
    text: 'default process',
    workspace_id: defaultWorkspace[0]
  })
  await knex.table('process_trigger').update({ process_id: defaultProcess[0] })
  await knex.schema
    .alterTable('process_trigger', table => {
      table.uuid('process_id').unsigned().notNullable().alter()
      table.foreign('process_id', 'FK_pt_process_id').references('id').inTable('process')
    })
}
