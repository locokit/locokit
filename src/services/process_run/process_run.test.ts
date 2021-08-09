import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { Database } from '../../models/database.model'
import { Process, ProcessTrigger } from '../../models/process.model'
import { ProcessRun, ProcessRunStatus } from '../../models/process_run.model'

import { Table } from '../../models/table.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { TableRow } from '../../models/tablerow.model'
import { Workspace } from '../../models/workspace.model'

import axios, { AxiosRequestConfig } from 'axios'
import { User } from '../../models/user.model'
import { Paginated, Params } from '@feathersjs/feathers'
import { LocalStrategy } from '@feathersjs/authentication-local/lib/strategy'

async function wait (duration: number): Promise<unknown> {
  return await new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}
describe('\'process_run\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-run')
    expect(service).toBeTruthy()
  })

  describe('add some rules', () => {
    let workspace: Workspace
    let database: Database
    let table1: Table
    let tableColumn: TableColumn
    let tableRow: TableRow
    let user: User
    const userEmail = 'process-run@locokit.io'
    const userPassword = 'pouetPOUET@0'
    let accessToken: string
    let params: Params
    const axiosMockPost = jest.fn(async (url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<any> => {
      return await new Promise(resolve => resolve({ data: { log: 'this is the log' } }))
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
        isVerified: true,
      }, {})
      const auth = await app.service('authentication').create({
        strategy: 'local',
        email: userEmail,
        password: userPassword,
      }, { })
      accessToken = auth.accessToken
      params = {
        provider: 'external',
        user,
        accessToken,
        authenticated: true,
      }
    })
    beforeEach(async () => {
      /**
       * create a process, process trigger, workspace, db, table
       */

      workspace = await app.service('workspace').create({ text: 'pouet' })
      const workspaceDatabases = await app.service('database').find({
        query: {
          workspace_id: workspace.id,
          $limit: 1,
        },
      }) as Paginated<Database>
      database = workspaceDatabases.data[0]
      table1 = await app.service('table').create({
        text: 'table1',
        database_id: database.id,
      })
      tableColumn = await app.service('column').create({
        text: 'My string column',
        table_id: table1.id,
        column_type_id: COLUMN_TYPE.STRING,
      })
      tableRow = await app.service('row').create({
        text: 'yo',
        table_id: table1.id,
        data: {
          [tableColumn.id]: 'This is a string',
        },
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
        trigger: ProcessTrigger.MANUAL,
      }) as Process

      const processRun = await app.service('process-run').create({
        process_id: processTrigger.id,
        table_row_id: tableRow.id,
      }) as ProcessRun
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
        trigger: ProcessTrigger.CRON,
      }) as Process

      const processExecutionCRON = await app.service('process-run').create({
        process_id: processTriggerCRON.id,
        table_row_id: tableRow.id,
      }, params) as ProcessRun
      expect(processExecutionCRON).toBeTruthy()
      expect(processExecutionCRON.status).toBe(ProcessRunStatus.RUNNING)

      const processTriggerMANUAL = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.MANUAL,
      }) as Process

      const processExecutionMANUAL = await app.service('process-run').create({
        process_id: processTriggerMANUAL.id,
        table_row_id: tableRow.id,
      }, params) as ProcessRun
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
        trigger: ProcessTrigger.CRON,
      }) as Process
      const processTriggerMANUAL = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.MANUAL,
      }) as Process
      const processTriggerCreateRow = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.CREATE_ROW,
      }) as Process
      const processTriggerUpdateRow = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW,
      }) as Process
      const processTriggerUpdateRowData = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW_DATA,
      }) as Process

      const processExecutionCRON = await app.service('process-run').create({
        process_id: processTriggerCRON.id,
        table_row_id: tableRow.id,
      }) as ProcessRun
      expect(processExecutionCRON).toBeTruthy()
      expect(processExecutionCRON.status).toBe(ProcessRunStatus.RUNNING)

      const processExecutionMANUAL = await app.service('process-run').create({
        process_id: processTriggerMANUAL.id,
        table_row_id: tableRow.id,
      }) as ProcessRun
      expect(processExecutionMANUAL).toBeTruthy()
      expect(processExecutionMANUAL.status).toBe(ProcessRunStatus.RUNNING)

      const processExecutionCreateRow = await app.service('process-run').create({
        process_id: processTriggerCreateRow.id,
        table_row_id: tableRow.id,
      }) as ProcessRun
      expect(processExecutionCreateRow).toBeTruthy()
      expect(processExecutionCreateRow.status).toBe(ProcessRunStatus.RUNNING)

      const processExecutionUpdateRow = await app.service('process-run').create({
        process_id: processTriggerUpdateRow.id,
        table_row_id: tableRow.id,
      }) as ProcessRun
      expect(processExecutionUpdateRow).toBeTruthy()
      expect(processExecutionUpdateRow.status).toBe(ProcessRunStatus.RUNNING)

      const processExecutionUpdateRowData = await app.service('process-run').create({
        process_id: processTriggerUpdateRowData.id,
        table_row_id: tableRow.id,
      }) as ProcessRun
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
        trigger: ProcessTrigger.CREATE_ROW,
      }) as Process
      const processTriggerUpdateRow = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW,
      }) as Process
      const processTriggerUpdateRowData = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW_DATA,
      }) as Process

      await expect(app.service('process-run').create({
        process_id: processTriggerCreateRow.id,
        table_row_id: tableRow.id,
      }, params)).rejects.toThrow()
      await expect(app.service('process-run').create({
        process_id: processTriggerUpdateRow.id,
        table_row_id: tableRow.id,
      }, params)).rejects.toThrow()
      await expect(app.service('process-run').create({
        process_id: processTriggerUpdateRowData.id,
        table_row_id: tableRow.id,
      }, params)).rejects.toThrow()

      await wait(1000)

      /**
       * check the status
       */
      await app.service('process').remove(processTriggerCreateRow.id)
      await app.service('process').remove(processTriggerUpdateRow.id)
      await app.service('process').remove(processTriggerUpdateRowData.id)
    })

    it('wait the end of the process if waitForOutput is sent', async () => {
      expect.assertions(4)
      /**
       * create an execution
       */
      const processTriggerCRON = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.CRON,
      }) as Process

      // we use waitForOutput, but it is to simulate how the front would call us
      const processExecutionCRON = await app.service('process-run').create({
        process_id: processTriggerCRON.id,
        table_row_id: tableRow.id,
        // @ts-expect-error
        waitForOutput: true,
      }, params) as ProcessRun
      expect(processExecutionCRON).toBeTruthy()
      expect(processExecutionCRON.status).toBe(ProcessRunStatus.SUCCESS)

      const processTriggerMANUAL = await app.service('process').create({
        table_id: table1.id,
        trigger: ProcessTrigger.MANUAL,
      }) as Process

      const processExecutionMANUAL = await app.service('process-run').create({
        process_id: processTriggerMANUAL.id,
        table_row_id: tableRow.id,
        // @ts-expect-error
        waitForOutput: true,
      }, params) as ProcessRun
      expect(processExecutionMANUAL).toBeTruthy()
      expect(processExecutionMANUAL.status).toBe(ProcessRunStatus.SUCCESS)

      await wait(1000)

      /**
       * check the status
       */
      await app.service('process-run').remove(processExecutionMANUAL.id)
      await app.service('process-run').remove(processExecutionCRON.id)
      await app.service('process').remove(processTriggerMANUAL.id)
      await app.service('process').remove(processTriggerCRON.id)
    })

    afterEach(async () => {
      await app.service('row').remove(tableRow.id)
      await app.service('column').remove(tableColumn.id)
      await app.service('table').remove(table1.id)
      await app.service('database').remove(database.id)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
      await app.service('workspace').remove(workspace.id)
    })

    afterAll(async () => {
      axios.post = originalAxiosPost
      await app.service('user')._remove(user.id)
    })
  })
})
