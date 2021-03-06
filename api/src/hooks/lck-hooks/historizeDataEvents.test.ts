import { COLUMN_TYPE, USER_PROFILE } from '@locokit/lck-glossary'

import { Paginated } from '@feathersjs/feathers'
import { AuthenticationResult } from '@feathersjs/authentication/lib'
import { LocalStrategy } from '@feathersjs/authentication-local/lib/strategy'

import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import { User } from '../../models/user.model'
import { Log, LOG_EVENT } from '../../models/log.model'
import { Process, ProcessTrigger } from '../../models/process.model'
import { ProcessRun } from '../../models/process_run.model'
import axios, { AxiosRequestConfig } from 'axios'
import { NotFound } from '@feathersjs/errors'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('historizeDataEvents hook', () => {
  let workspace: Workspace
  let database: Database
  let user: User
  let authentication: AuthenticationResult
  let table1: Table
  let table2: Table
  let table1ColumnText: TableColumn
  let table1ColumnFormula: TableColumn
  let table2ColumnRelationBetweenTable1: TableColumn
  let table2ColumnLookedUpColumnTable1Text: TableColumn
  let table1Row1: TableRow
  let table2Row1: TableRow

  const firstText = 'First text.'
  const firstUpperCaseText = firstText.toUpperCase()
  const secondText = 'Second text.'
  const secondUpperCaseText = secondText.toUpperCase()

  const axiosMockPost = jest.fn(async (url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<any> => {
    return await new Promise(resolve => resolve({ data: { log: 'this is the log' } }))
  })
  const originalAxiosPost = axios.post

  let outsideCallParams: object = {}

  beforeAll(async () => {
    // Mock axios function for process
    axios.post = axiosMockPost

    // Create a fake user
    const userEmail = 'hello-virtual@locokit.io1'
    const userPassword = 'hello-virtual@locokit.io'

    const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
    const passwordHashed = await localStrategy.hashPassword(userPassword, {})
    user = await app.service('user')._create({
      name: 'John',
      email: userEmail,
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.SUPERADMIN,
    }, {})

    // Simulate the authentication
    authentication = await app.service('authentication').create({
      strategy: 'local',
      email: userEmail,
      password: userPassword,
    }, {})

    // Simulate an outside call
    outsideCallParams = {
      provider: 'external',
      authenticated: true,
      user,
      accessToken: authentication.accessToken,
    }

    // Create workspace
    workspace = await app.service('workspace').create({ text: 'workspace1' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    database = workspaceDatabases.data[0]

    // Create tables
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id,
    })
    table2 = await app.service('table').create({
      text: 'table2',
      database_id: database.id,
    })

    // Create columns

    // Table 1
    table1ColumnText = await app.service('column').create({
      text: 'Text',
      column_type_id: COLUMN_TYPE.TEXT,
      table_id: table1.id,
      reference: true,
      reference_position: 0,
      settings: {},
    })
    table1ColumnFormula = await app.service('column').create({
      text: 'Formula',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: `TEXT.UPPER(COLUMN.{${table1ColumnText.id}})`,
      },
    })

    // Table 2
    table2ColumnRelationBetweenTable1 = await app.service('column').create({
      text: 'RBT 2 -> 1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    table2ColumnLookedUpColumnTable1Text = await app.service('column').create({
      text: 'VLUC 2 -> 1 (Text bis)',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        localField: table2ColumnRelationBetweenTable1.id,
        foreignField: table1ColumnText.id,
      },
    })
  })

  describe('historize the right events in the child table', () => {
    beforeAll(async () => {
      // Create a row
      table1Row1 = await app.service('row').create({
        table_id: table1.id,
        text: 'table 1 row 1',
        data: {
          [table1ColumnText.id]: firstText,
        },
      }, outsideCallParams)
    })

    afterAll(async () => {
      // Clean DB
      try {
        await app.service('log').remove(null, {
          record_id: table1Row1.id,
        })
      } catch (error) {
        if (!(error instanceof NotFound)) throw error
      }

      try {
        await app.service('row').remove(table1Row1.id)
      } catch (error) {
        if (!(error instanceof NotFound)) throw error
      }
    })

    beforeEach(async () => {
      // Create a row
      table2Row1 = await app.service('row').create({
        table_id: table2.id,
        text: 'table 2 row 1',
        data: {
          [table2ColumnRelationBetweenTable1.id]: table1Row1.id,
        },
      }, outsideCallParams)
    })

    afterEach(async () => {
      // Clean DB
      try {
        await app.service('log').remove(null, {
          record_id: table2Row1.id,
        })
      } catch (error) {
        if (!(error instanceof NotFound)) throw error
      }

      try {
        await app.service('row').remove(table2Row1.id)
      } catch (error) {
        if (!(error instanceof NotFound)) throw error
      }
    })

    it('at creation', async () => {
      expect.assertions(10)

      // Check that the data is correctly initialized
      expect(table2Row1.data).toStrictEqual({
        [table2ColumnRelationBetweenTable1.id]: {
          reference: table1Row1.id,
          value: table1Row1.text,
        },
        [table2ColumnLookedUpColumnTable1Text.id]: {
          reference: table1Row1.id,
          value: firstText,
        },
      })

      // Check that the logs are correct
      const logs = await app.service('log').find({
        query: {
          record_id: table2Row1.id,
        },
        paginate: false,
      }) as Log[]

      expect(logs.length).toBe(1)

      const createLog = logs[0]

      expect(createLog.createdAt).toBeDefined()
      expect(createLog.event).toBe(LOG_EVENT.RECORD_CREATE)
      expect(createLog.field_id).toBeNull()
      expect(createLog.from).toBeNull()
      expect(createLog.record_id).toBe(table2Row1.id)
      expect(createLog.to).toStrictEqual({
        [table2ColumnRelationBetweenTable1.id]: {
          reference: table1Row1.id,
          value: table1Row1.text,
        },
      })
      expect(createLog.updatedAt).toBeDefined()
      expect(createLog.user_id).toBe(user.id)
    })

    it('don\'t keep logs on internal updating (e.g. when computing a formula)', async () => {
      expect.assertions(3)

      // Update the linked row
      table1Row1 = await app.service('row').patch(table1Row1.id, {
        data: {
          [table1ColumnText.id]: secondText,
        },
      }, outsideCallParams)

      table2Row1 = await app.service('row').get(table2Row1.id)

      const logs = await app.service('log').find({
        query: {
          record_id: table2Row1.id,
        },
        paginate: false,
      }) as Log[]

      // We just have the create log, not an update one
      expect(logs).toHaveLength(1)
      expect(logs[0].event).toBe(LOG_EVENT.RECORD_CREATE)

      // Check the child row is correctly updated
      expect(table2Row1.data[table2ColumnLookedUpColumnTable1Text.id]).toStrictEqual({
        reference: table1Row1.id,
        value: secondText,
      })
    })
  })

  describe('historize the right events in the base table', () => {
    beforeEach(async () => {
      // Create a row
      table1Row1 = await app.service('row').create({
        table_id: table1.id,
        text: 'table 1 row 1',
        data: {
          [table1ColumnText.id]: firstText,
        },
      }, outsideCallParams)
    })

    afterEach(async () => {
      // Clean DB
      try {
        await app.service('log').remove(null, {
          record_id: table1Row1.id,
        })
      } catch (error) {
        if (!(error instanceof NotFound)) throw error
      }

      try {
        await app.service('row').remove(table1Row1.id)
      } catch (error) {
        if (!(error instanceof NotFound)) throw error
      }
    })

    it('at creation', async () => {
      expect.assertions(10)

      // Check that the data is correctly initialized
      expect(table1Row1.data).toStrictEqual({
        [table1ColumnText.id]: firstText,
        [table1ColumnFormula.id]: firstUpperCaseText,
      })

      // Check that the logs are correct
      const logs = await app.service('log').find({
        query: {
          record_id: table1Row1.id,
        },
        paginate: false,
      }) as Log[]

      expect(logs.length).toBe(1)

      const createLog = logs[0]

      expect(createLog.createdAt).toBeDefined()
      expect(createLog.event).toBe(LOG_EVENT.RECORD_CREATE)
      expect(createLog.field_id).toBeNull()
      expect(createLog.from).toBeNull()
      expect(createLog.record_id).toBe(table1Row1.id)
      expect(createLog.to).toStrictEqual({
        [table1ColumnText.id]: firstText,
      })
      expect(createLog.updatedAt).toBeDefined()
      expect(createLog.user_id).toBe(user.id)
    })

    it('when updating', async () => {
      expect.assertions(10)

      // Update the row
      table1Row1 = await app.service('row').update(table1Row1.id, {
        ...table1Row1,
        data: {
          [table1ColumnText.id]: secondText,
        },
      }, outsideCallParams)

      // Check that the data is correctly updated
      expect(table1Row1.data).toStrictEqual({
        [table1ColumnText.id]: secondText,
        [table1ColumnFormula.id]: secondUpperCaseText,
      })

      // Check that the logs are correct
      const logs = await app.service('log').find({
        query: {
          record_id: table1Row1.id,
          $sort: {
            createdAt: 1,
          },
        },
        paginate: false,
      }) as Log[]

      expect(logs.length).toBe(2)

      const updateLog = logs[1]

      expect(updateLog.createdAt).toBeDefined()
      expect(updateLog.event).toBe(LOG_EVENT.RECORD_UPDATE)
      expect(updateLog.field_id).toBeNull()
      expect(updateLog.from).toStrictEqual({
        [table1ColumnText.id]: firstText,
      })
      expect(updateLog.record_id).toBe(table1Row1.id)
      expect(updateLog.to).toStrictEqual({
        [table1ColumnText.id]: secondText,
      })
      expect(updateLog.updatedAt).toBeDefined()
      expect(updateLog.user_id).toBe(user.id)
    })

    it('when patching', async () => {
      expect.assertions(10)

      // Patch the row
      table1Row1 = await app.service('row').patch(table1Row1.id, {
        data: {
          [table1ColumnText.id]: secondText,
        },
      }, outsideCallParams)

      // Check that the data is correctly updated
      expect(table1Row1.data).toStrictEqual({
        [table1ColumnText.id]: secondText,
        [table1ColumnFormula.id]: secondUpperCaseText,
      })

      // Check that the logs are correct
      const logs = await app.service('log').find({
        query: {
          record_id: table1Row1.id,
          $sort: {
            createdAt: 1,
          },
        },
        paginate: false,
      }) as Log[]

      expect(logs.length).toBe(2)

      const updateLog = logs[1]

      expect(updateLog.createdAt).toBeDefined()
      expect(updateLog.event).toBe(LOG_EVENT.RECORD_PATCH)
      expect(updateLog.field_id).toBe(table1ColumnText.id)
      expect(updateLog.from).toStrictEqual({
        [table1ColumnText.id]: firstText,
      })
      expect(updateLog.record_id).toBe(table1Row1.id)
      expect(updateLog.to).toStrictEqual({
        [table1ColumnText.id]: secondText,
      })
      expect(updateLog.updatedAt).toBeDefined()
      expect(updateLog.user_id).toBe(user.id)
    })

    it('when using a process linked to this table', async () => {
      expect.assertions(2)
      // Create the process
      const rowUpdateProcess = await app.service('process').create({
        workspace_id: workspace.id,
        text: 'myFirstProcess',
        table_id: table1.id,
        trigger: ProcessTrigger.UPDATE_ROW,
        enabled: true,
        url: '',
      }) as Process

      try {
        // Patch the row
        table1Row1 = await app.service('row').patch(table1Row1.id, {
          data: {
            [table1ColumnText.id]: secondText,
          },
        }, outsideCallParams)

        // Check that the logs are correct
        const logs = await app.service('log').find({
          query: {
            record_id: table1Row1.id,
            $sort: {
              createdAt: 1,
            },
          },
          paginate: false,
        }) as Log[]

        expect(logs.length).toBe(2)

        // Check that the related process run is linked to the log
        const processRuns = await app.service('process-run').find({
          query: {
            process_id: rowUpdateProcess.id,
            table_row_id: table1Row1.id,
            data_log_id: logs[1].id,
          },
          paginate: false,
        }) as ProcessRun[]
        expect(processRuns.length).toBe(1)
      } finally {
        // Clean DB
        await app.service('process-run').remove(null, { process_id: rowUpdateProcess.id })
        await app.service('process').remove(rowUpdateProcess.id)
      }
    })

    it('when removing the column', async () => {
      expect.assertions(10)

      // Create a temporary column
      const tempColumn = await app.service('column').create({
        text: 'Temp',
        column_type_id: COLUMN_TYPE.NUMBER,
        table_id: table1.id,
        settings: {},
      })

      // Patch the row
      await app.service('row').patch(table1Row1.id, {
        data: {
          [tempColumn.id]: 10,
        },
      }, outsideCallParams)

      const logs = await app.service('log').find({
        query: {
          field_id: tempColumn.id,
        },
        paginate: false,
      }) as Log[]

      expect(logs).toHaveLength(1)

      const updateLog = logs[0]

      expect(updateLog.createdAt).toBeDefined()
      expect(updateLog.event).toBe(LOG_EVENT.RECORD_PATCH)
      expect(updateLog.field_id).toBe(tempColumn.id)
      expect(updateLog.from).toStrictEqual({})
      expect(updateLog.record_id).toBe(table1Row1.id)
      expect(updateLog.to).toStrictEqual({
        [tempColumn.id]: 10,
      })
      expect(updateLog.updatedAt).toBeDefined()
      expect(updateLog.user_id).toBe(user.id)

      // Remove the column
      await app.service('column').remove(tempColumn.id, { ...outsideCallParams })

      // Check that logs are removed
      const newLogs = await app.service('log').find({
        query: {
          field_id: tempColumn.id,
          $limit: 0,
        },
      }) as Paginated<Log>

      expect(newLogs.total).toBe(0)
    })

    it('when removing the row', async () => {
      expect.assertions(2)

      // Patch the row
      await app.service('row').patch(table1Row1.id, {
        data: {
          [table1ColumnText.id]: secondText,
        },
      }, outsideCallParams)

      let logs = await app.service('log').find({
        query: {
          record_id: table1Row1.id,
          $limit: 0,
        },
      }) as Paginated<Log>

      expect(logs.total).toBe(2)

      // Remove the row
      await app.service('row').remove(table1Row1.id, { ...outsideCallParams })

      // Check that logs are removed
      logs = await app.service('log').find({
        query: {
          record_id: table1Row1.id,
          $limit: 0,
        },
      }) as Paginated<Log>

      expect(logs.total).toBe(0)
    })
  })

  afterAll(async () => {
    // Reset axios function
    axios.post = originalAxiosPost

    // Clean user
    await app.service('user').remove(user.id)

    // Clean table 2
    await app.service('column').remove(table2ColumnLookedUpColumnTable1Text.id)
    await app.service('column').remove(table2ColumnRelationBetweenTable1.id)
    await app.service('table').remove(table2.id)

    // Clean table 1
    await app.service('column').remove(table1ColumnFormula.id)
    await app.service('column').remove(table1ColumnText.id)
    await app.service('table').remove(table1.id)

    // Clean workspace
    await dropWorkspace(app, workspace.id)
  })
})
