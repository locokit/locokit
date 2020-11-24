import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('process_trigger', table => {
      table.boolean('enabled')
    })
    .alterTable('process_execution', table => {
      table.dropColumn('when')
      table.dropColumn('result')
      table.enum('status', ['RUNNING', 'SUCCESS', 'ERROR', 'WARNING'])
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('process_trigger', table => {
      table.dropColumn('enabled')
    })
    .alterTable('process_execution', table => {
      table.timestamp('when')
      table.enum('result', ['SUCCESS', 'ERROR', 'WARNING'])
      table.dropColumn('status')
    })
}
