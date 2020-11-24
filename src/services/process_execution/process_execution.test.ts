import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { database } from '../../models/database.model'
import { ProcessExecutionStatus } from '../../models/process_execution.model'
import { ProcessTriggerEvent } from '../../models/process_trigger.model'
import { table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'

describe('\'process_execution\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-execution')
    expect(service).toBeTruthy()
  })
  it('set status to RUNNING if not set by creation data', async () => {
    expect.assertions(1)
    /**
     * create a process, process trigger, workspace, db, table
     */
    const workspace: workspace = await app.service('workspace').create({ text: 'pouet' })
    const database: database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    const table1: table = await app.service('table').create({
      text: 'table1',
      database_id: database.id
    })
    const tableColumn = await app.service('column').create({
      text: 'My string column',
      table_id: table1.id,
      column_type_id: COLUMN_TYPE.STRING
    })
    const tableRow = await app.service('row').create({
      text: 'yo',
      table_id: table1.id,
      data: {
        [tableColumn.id]: 'This is a string'
      }
    })
    const process = await app.service('process').create({
      text: 'My Process',
      workspace_id: workspace.id,
      url: ''
    })
    const processTrigger = await app.service('process-trigger').create({
      table_id: table1.id,
      process_id: process.id,
      event: ProcessTriggerEvent.MANUAL
    })
    /**
     * create an execution
     */
    const processExecution = await app.service('process-execution').create({
      process_trigger_id: processTrigger.id,
      table_row_id: tableRow.id
    })
    /**
     * check the status
     */
    expect(processExecution.status).toBe(ProcessExecutionStatus.RUNNING)

    /**
     * Teardown
     */
    await app.service('process-execution').remove(processExecution.id)
    await app.service('process-trigger').remove(processTrigger.id)
    await app.service('process').remove(process.id)
    await app.service('row').remove(tableRow.id)
    await app.service('column').remove(tableColumn.id)
    await app.service('table').remove(table1.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
