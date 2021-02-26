import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { database } from '../../models/database.model'
import { ProcessTrigger } from '../../models/process.model'
import { ProcessRunStatus } from '../../models/process_run.model'

import { Table } from '../../models/table.model'
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
describe('\'process_run\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-run')
    expect(service).toBeTruthy()
  })

  describe('add some rules', () => {
    let workspace: workspace
    let database: database
    let table1: Table
    let tableColumn: TableColumn
    let tableRow: TableRow
    let user: User
    const userEmail = 'process-run@locokit.io'
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
      // process = await app.service('process').create({
      //   text: 'My Process',
      //   workspace_id: workspace.id,
      //   url: ''
      // })
    })

    it('set status to RUNNING if not set by creation data', async () => {
      expect.assertions(2)
      /**
       * create an execution
       */
      const processTrigger = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.MANUAL
      })

      const processRun = await app.service('process-run').create({
        process_id: processTrigger.id,
        table_row_id: tableRow.id
      })
      /**
       * check the status
       */
      expect(processRun).toBeTruthy()
      expect(processRun.status).toBe(ProcessRunStatus.RUNNING)

      await wait(1000)

      await app.service('process-run').remove(processRun.id)
      await app.service('process').remove(processTrigger.id)
    })

    it('allow the creation of the execution if the provider is external and the trigger is MANUAL or CRON', async () => {
      expect.assertions(4)
      /**
       * create an execution
       */
      const processTriggerCRON = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.CRON
      })

      const processExecutionCRON = await app.service('process-run').create({
        process_id: processTriggerCRON.id,
        table_row_id: tableRow.id
      }, params)
      expect(processExecutionCRON).toBeTruthy()
      expect(processExecutionCRON.status).toBe(ProcessRunStatus.RUNNING)

      const processTriggerMANUAL = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.MANUAL
      })

      const processExecutionMANUAL = await app.service('process-run').create({
        process_id: processTriggerMANUAL.id,
        table_row_id: tableRow.id
      }, params)
      expect(processExecutionMANUAL).toBeTruthy()
      expect(processExecutionMANUAL.status).toBe(ProcessRunStatus.RUNNING)

      await wait(1000)

      /**
       * check the status
       */
      await app.service('process-run').remove(processExecutionMANUAL.id)
      await app.service('process-run').remove(processExecutionCRON.id)
      await app.service('process').remove(processTriggerMANUAL.id)
      await app.service('process').remove(processTriggerCRON.id)
    })

    it('allow the creation of the execution if the provider is not external', async () => {
      expect.assertions(10)
      /**
       * create an execution
       */
      const processTriggerCRON = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.CRON
      })
      const processTriggerMANUAL = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.MANUAL
      })
      const processTriggerCreateRow = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.CREATE_ROW
      })
      const processTriggerUpdateRow = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW
      })
      const processTriggerUpdateRowData = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW_DATA
      })

      const processExecutionCRON = await app.service('process-run').create({
        process_id: processTriggerCRON.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionCRON).toBeTruthy()
      expect(processExecutionCRON.status).toBe(ProcessRunStatus.RUNNING)

      const processExecutionMANUAL = await app.service('process-run').create({
        process_id: processTriggerMANUAL.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionMANUAL).toBeTruthy()
      expect(processExecutionMANUAL.status).toBe(ProcessRunStatus.RUNNING)

      const processExecutionCreateRow = await app.service('process-run').create({
        process_id: processTriggerCreateRow.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionCreateRow).toBeTruthy()
      expect(processExecutionCreateRow.status).toBe(ProcessRunStatus.RUNNING)

      const processExecutionUpdateRow = await app.service('process-run').create({
        process_id: processTriggerUpdateRow.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionUpdateRow).toBeTruthy()
      expect(processExecutionUpdateRow.status).toBe(ProcessRunStatus.RUNNING)

      const processExecutionUpdateRowData = await app.service('process-run').create({
        process_id: processTriggerUpdateRowData.id,
        table_row_id: tableRow.id
      })
      expect(processExecutionUpdateRowData).toBeTruthy()
      expect(processExecutionUpdateRowData.status).toBe(ProcessRunStatus.RUNNING)

      await wait(1000)

      /**
       * check the status
       */
      await app.service('process-run').remove(processExecutionUpdateRowData.id)
      await app.service('process-run').remove(processExecutionUpdateRow.id)
      await app.service('process-run').remove(processExecutionCreateRow.id)
      await app.service('process-run').remove(processExecutionMANUAL.id)
      await app.service('process-run').remove(processExecutionCRON.id)
      await app.service('process').remove(processTriggerUpdateRowData.id)
      await app.service('process').remove(processTriggerUpdateRow.id)
      await app.service('process').remove(processTriggerCreateRow.id)
      await app.service('process').remove(processTriggerMANUAL.id)
      await app.service('process').remove(processTriggerCRON.id)
    })

    it('throw the creation of the execution if the provider is external and the trigger not MANUAL | CRON', async () => {
      expect.assertions(3)
      /**
       * create an execution
       */
      const processTriggerCreateRow = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.CREATE_ROW
      })
      const processTriggerUpdateRow = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW
      })
      const processTriggerUpdateRowData = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW_DATA
      })

      await expect(app.service('process-run').create({
        process_id: processTriggerCreateRow.id,
        table_row_id: tableRow.id
      }, params)).rejects.toThrow()
      await expect(app.service('process-run').create({
        process_id: processTriggerUpdateRow.id,
        table_row_id: tableRow.id
      }, params)).rejects.toThrow()
      await expect(app.service('process-run').create({
        process_id: processTriggerUpdateRowData.id,
        table_row_id: tableRow.id
      }, params)).rejects.toThrow()

      await wait(1000)

      /**
       * check the status
       */
      await app.service('process').remove(processTriggerCreateRow.id)
      await app.service('process').remove(processTriggerUpdateRow.id)
      await app.service('process').remove(processTriggerUpdateRowData.id)
    })

    afterEach(async () => {
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
