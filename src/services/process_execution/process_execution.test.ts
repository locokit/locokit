import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { database } from '../../models/database.model'
import { Process } from '../../models/process.model'
import { ProcessExecutionStatus } from '../../models/process_execution.model'
import { ProcessTriggerEvent } from '../../models/process_trigger.model'
import { table } from '../../models/table.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { TableRow } from '../../models/tablerow.model'
import { workspace } from '../../models/workspace.model'

import axios, { AxiosRequestConfig } from 'axios'
import { User } from '../../models/user.model'
import { Params } from '@feathersjs/feathers'
import { LocalStrategy } from '@feathersjs/authentication-local/lib/strategy'

function wait (duration: number) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}
describe('\'process_execution\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-execution')
    expect(service).toBeTruthy()
  })

  describe('add some rules', () => {
    let workspace: workspace
    let database: database
    let table1: table
    let tableColumn: TableColumn
    let tableRow: TableRow
    let process: Process
    let user: User
    const userEmail = 'process-exec@locokit.io'
    const userPassword = 'pouetPOUET@0'
    let accessToken: string
    let params: Params
    const axiosMockPost = jest.fn((url: string, data?: any, config?: AxiosRequestConfig | undefined) : Promise<any> => {
      return new Promise(resolve => resolve({ data: { log: 'this is the log' } }))
    })
    const originalAxiosPost = axios.post

    beforeAll(async () => {
      axios.post = axiosMockPost
      const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
      const passwordHashed = await localStrategy.hashPassword(userPassword, {})

      user = await app.service('user')._create({
        email: userEmail,
        name: 'Process Exec',
        password: passwordHashed,
        isVerified: true
      }, {})
      const auth = await app.service('authentication').create({
        strategy: 'local',
        email: userEmail,
        password: userPassword
      }, { })
      accessToken = auth.accessToken
      params = {
        provider: 'external',
        user,
        accessToken,
        authenticated: true
      }
    })
    beforeEach(async () => {
      /**
       * create a process, process trigger, workspace, db, table
       */

      workspace = await app.service('workspace').create({ text: 'pouet' })
      database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
      table1 = await app.service('table').create({
        text: 'table1',
        database_id: database.id
      })
      tableColumn = await app.service('column').create({
        text: 'My string column',
        table_id: table1.id,
        column_type_id: COLUMN_TYPE.STRING
      })
      tableRow = await app.service('row').create({
        text: 'yo',
        table_id: table1.id,
        data: {
          [tableColumn.id]: 'This is a string'
        }
      })
      process = await app.service('process').create({
        text: 'My Process',
        workspace_id: workspace.id,
        url: ''
      })
    })

    it('set status to RUNNING if not set by creation data', async () => {
      expect.assertions(2)
      /**
       * create an execution
       */
      const processTrigger = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.MANUAL
      })

      const processExecution = await app.service('process-execution').create({
        process_trigger_id: processTrigger.id,
        table_row_id: tableRow.id
      })
      /**
       * check the status
       */
      expect(processExecution).toBeTruthy()
      expect(processExecution.status).toBe(ProcessExecutionStatus.RUNNING)

      await wait(1000)

      await app.service('process-execution').remove(processExecution.id)
      await app.service('process-trigger').remove(processTrigger.id)
    })

    it('allow the creation of the execution if the provider is external and the trigger is MANUAL or CRON', async () => {
      expect.assertions(4)
      /**
       * create an execution
       */
      const processTriggerCRON = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.CRON
      })

      const processExecutionCRON = await app.service('process-execution').create({
        process_trigger_id: processTriggerCRON.id,
        table_row_id: tableRow.id
      }, params)
      expect(processExecutionCRON).toBeTruthy()
      expect(processExecutionCRON.status).toBe(ProcessExecutionStatus.RUNNING)

      const processTriggerMANUAL = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.MANUAL
      })

      const processExecutionMANUAL = await app.service('process-execution').create({
        process_trigger_id: processTriggerMANUAL.id,
        table_row_id: tableRow.id
      }, params)
      expect(processExecutionMANUAL).toBeTruthy()
      expect(processExecutionMANUAL.status).toBe(ProcessExecutionStatus.RUNNING)

      await wait(1000)

      /**
       * check the status
       */
      await app.service('process-execution').remove(processExecutionMANUAL.id)
      await app.service('process-execution').remove(processExecutionCRON.id)
      await app.service('process-trigger').remove(processTriggerMANUAL.id)
      await app.service('process-trigger').remove(processTriggerCRON.id)
    })

    it('allow the creation of the execution if the provider is not external', async () => {
      expect.assertions(10)
      /**
       * create an execution
       */
      const processTriggerCRON = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.CRON
      })
      const processTriggerMANUAL = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.MANUAL
      })
      const processTriggerCreateRow = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.CREATE_ROW
      })
      const processTriggerUpdateRow = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.UPDATE_ROW
      })
      const processTriggerUpdateRowData = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.UPDATE_ROW_DATA
      })

      const processExecutionCRON = await app.service('process-execution').create({
        process_trigger_id: processTriggerCRON.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionCRON).toBeTruthy()
      expect(processExecutionCRON.status).toBe(ProcessExecutionStatus.RUNNING)

      const processExecutionMANUAL = await app.service('process-execution').create({
        process_trigger_id: processTriggerMANUAL.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionMANUAL).toBeTruthy()
      expect(processExecutionMANUAL.status).toBe(ProcessExecutionStatus.RUNNING)

      const processExecutionCreateRow = await app.service('process-execution').create({
        process_trigger_id: processTriggerCreateRow.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionCreateRow).toBeTruthy()
      expect(processExecutionCreateRow.status).toBe(ProcessExecutionStatus.RUNNING)

      const processExecutionUpdateRow = await app.service('process-execution').create({
        process_trigger_id: processTriggerUpdateRow.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionUpdateRow).toBeTruthy()
      expect(processExecutionUpdateRow.status).toBe(ProcessExecutionStatus.RUNNING)

      const processExecutionUpdateRowData = await app.service('process-execution').create({
        process_trigger_id: processTriggerUpdateRowData.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionUpdateRowData).toBeTruthy()
      expect(processExecutionUpdateRowData.status).toBe(ProcessExecutionStatus.RUNNING)

      await wait(1000)

      /**
       * check the status
       */
      await app.service('process-execution').remove(processExecutionUpdateRowData.id)
      await app.service('process-execution').remove(processExecutionUpdateRow.id)
      await app.service('process-execution').remove(processExecutionCreateRow.id)
      await app.service('process-execution').remove(processExecutionMANUAL.id)
      await app.service('process-execution').remove(processExecutionCRON.id)
      await app.service('process-trigger').remove(processTriggerUpdateRowData.id)
      await app.service('process-trigger').remove(processTriggerUpdateRow.id)
      await app.service('process-trigger').remove(processTriggerCreateRow.id)
      await app.service('process-trigger').remove(processTriggerMANUAL.id)
      await app.service('process-trigger').remove(processTriggerCRON.id)
    })

    it('throw the creation of the execution if the provider is external and the trigger not MANUAL | CRON', async () => {
      expect.assertions(3)
      /**
       * create an execution
       */
      const processTriggerCreateRow = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.CREATE_ROW
      })
      const processTriggerUpdateRow = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.UPDATE_ROW
      })
      const processTriggerUpdateRowData = await app.service('process-trigger').create({
        table_id: table1.id,
        process_id: process.id,
        event: ProcessTriggerEvent.UPDATE_ROW_DATA
      })

      await expect(app.service('process-execution').create({
        process_trigger_id: processTriggerCreateRow.id,
        table_row_id: tableRow.id
      }, params)).rejects.toThrow()
      await expect(app.service('process-execution').create({
        process_trigger_id: processTriggerUpdateRow.id,
        table_row_id: tableRow.id
      }, params)).rejects.toThrow()
      await expect(app.service('process-execution').create({
        process_trigger_id: processTriggerUpdateRowData.id,
        table_row_id: tableRow.id
      }, params)).rejects.toThrow()

      await wait(1000)

      /**
       * check the status
       */
      await app.service('process-trigger').remove(processTriggerCreateRow.id)
      await app.service('process-trigger').remove(processTriggerUpdateRow.id)
      await app.service('process-trigger').remove(processTriggerUpdateRowData.id)
    })

    afterEach(async () => {
      await app.service('process').remove(process.id)
      await app.service('row').remove(tableRow.id)
      await app.service('column').remove(tableColumn.id)
      await app.service('table').remove(table1.id)
      await app.service('database').remove(database.id)
      await app.service('workspace').remove(workspace.id)
    })

    afterAll(async () => {
      axios.post = originalAxiosPost
      await app.service('user')._remove(user.id)
    })
  })
})
