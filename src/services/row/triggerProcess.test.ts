import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { database } from '../../models/database.model'
import { Process, ProcessTrigger } from '../../models/process.model'

import { Table } from '../../models/table.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { TableRow } from '../../models/tablerow.model'
import { workspace } from '../../models/workspace.model'

import axios, { AxiosRequestConfig } from 'axios'
import { ProcessRun } from '../../models/process_run.model'
import { Paginated } from '@feathersjs/feathers'

describe('\'triggerProcess\' hook', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let tableColumn: TableColumn
  let tableColumn1: TableColumn
  let tableFormulaColumn: TableColumn
  let tableRow1: TableRow
  let tableRow2: TableRow
  const axiosMockPost = jest.fn((url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<any> => {
    return new Promise(resolve => resolve({ data: { log: 'this is the log' } }))
  })
  const originalAxiosPost = axios.post

  beforeAll(async () => {
    axios.post = axiosMockPost
  })
  beforeEach(async () => {
    /**
     * create a process, process trigger, workspace, db, table
     */
    workspace = await app.service('workspace').create({ text: 'pouet' })
    database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id,
    })
    tableColumn = await app.service('column').create({
      text: 'My string column',
      table_id: table1.id,
      column_type_id: COLUMN_TYPE.STRING,
    })
    tableColumn1 = await app.service('column').create({
      text: 'My other column',
      table_id: table1.id,
      column_type_id: COLUMN_TYPE.STRING,
    })
    tableFormulaColumn = await app.service('column').create({
      text: 'My Formula column',
      table_id: table1.id,
      column_type_id: COLUMN_TYPE.FORMULA,
      settings: {
        formula: '10',
      },
    })
  })

  it('do not trigger if no process trigger are configured', async () => {
    expect.assertions(1)
    tableRow1 = await app.service('row').create({
      text: 'yo',
      table_id: table1.id,
      data: {
        [tableColumn.id]: 'This is a string',
        [tableColumn1.id]: 'This is another string',
      },
    })
    await app.service('row').patch(tableRow1.id, {
      data: {
        [tableColumn.id]: 'yolo',
      },
    })
    await app.service('row').remove(tableRow1.id)

    const allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]
    expect(allExecutions.length).toBe(0)
  })

  it('do not trigger if process triggers are MANUAL or CRON', async () => {
    expect.assertions(1)

    const processTriggerManual = await app.service('process').create({
      table_id: table1.id,
      trigger: ProcessTrigger.MANUAL,
      enabled: true,
    }) as Process
    const processTriggerCron = await app.service('process').create({
      table_id: table1.id,
      trigger: ProcessTrigger.MANUAL,
      enabled: true,
    }) as Process
    tableRow1 = await app.service('row').create({
      text: 'yo',
      table_id: table1.id,
      data: {
        [tableColumn.id]: 'This is a string',
        [tableColumn1.id]: 'This is another string',
      },
    })
    await app.service('row').patch(tableRow1.id, {
      data: {
        [tableColumn.id]: 'yolo',
      },
    })
    await app.service('row').remove(tableRow1.id)

    const allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]
    expect(allExecutions.length).toBe(0)

    await app.service('process').remove(processTriggerCron.id)
    await app.service('process').remove(processTriggerManual.id)
  })
  it('trigger CREATE_ROW if process triggers is enabled and well configured', async () => {
    expect.assertions(3)

    const processTriggerCreateRow = await app.service('process').create({
      table_id: table1.id,
      trigger: ProcessTrigger.CREATE_ROW,
      enabled: true,
    }) as Process
    tableRow1 = await app.service('row').create({
      text: 'yo',
      table_id: table1.id,
      data: {
        [tableColumn.id]: 'This is a string',
        [tableColumn1.id]: 'This is another string',
      },
    })
    await app.service('row').patch(tableRow1.id, {
      data: {
        [tableColumn.id]: 'yolo',
      },
    })

    const allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]
    expect(allExecutions.length).toBe(1)
    expect(allExecutions[0].process_id).toBe(processTriggerCreateRow.id)
    expect(allExecutions[0].table_row_id).toBe(tableRow1.id)

    await app.service('row').remove(tableRow1.id)
    // await app.service('process-run').remove(allExecutions[0].id)
    await app.service('process').remove(processTriggerCreateRow.id)
  })

  it('trigger UPDATE_ROW if process triggers is enabled and well configured', async () => {
    expect.assertions(4)

    const processTriggerCreateRow = await app.service('process').create({
      table_id: table1.id,
      trigger: ProcessTrigger.UPDATE_ROW,
      enabled: true,
    }) as Process
    tableRow1 = await app.service('row').create({
      text: 'yo',
      table_id: table1.id,
      data: {
        [tableColumn.id]: 'This is a string',
        [tableColumn1.id]: 'This is another string',
      },
    })
    let allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]
    expect(allExecutions.length).toBe(0)

    await app.service('row').patch(tableRow1.id, {
      data: {
        [tableColumn.id]: 'yolo',
      },
    })

    allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]

    expect(allExecutions.length).toBe(1)

    expect(allExecutions[0].process_id).toBe(processTriggerCreateRow.id)
    expect(allExecutions[0].table_row_id).toBe(tableRow1.id)

    await app.service('row').remove(tableRow1.id)
    // await app.service('process-run').remove(allExecutions[0].id)
    await app.service('process').remove(processTriggerCreateRow.id)
  })

  it('trigger UPDATE_ROW_DATA if process triggers is enabled and well configured', async () => {
    expect.assertions(5)

    const processTriggerCreateRow = await app.service('process').create({
      table_id: table1.id,
      trigger: ProcessTrigger.UPDATE_ROW_DATA,
      enabled: true,
      settings: {
        column_id: tableColumn1.id,
      },
    }) as Process
    tableRow1 = await app.service('row').create({
      text: 'yo',
      table_id: table1.id,
      data: {
        [tableColumn.id]: 'This is a string',
        [tableColumn1.id]: 'This is another string',
      },
    })
    let allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]
    expect(allExecutions.length).toBe(0)

    /**
     * We patch the tableColumn,
     * the process must not be trigerred
     */
    await app.service('row').patch(tableRow1.id, {
      data: {
        [tableColumn.id]: 'yolo',
      },
    })

    allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]

    expect(allExecutions.length).toBe(0)

    /**
     * We patch the tableColumn1,
     * the process must be trigerred
     */
    await app.service('row').patch(tableRow1.id, {
      data: {
        [tableColumn1.id]: 'yolo',
      },
    })

    allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]

    expect(allExecutions.length).toBe(1)

    expect(allExecutions[0].process_id).toBe(processTriggerCreateRow.id)
    expect(allExecutions[0].table_row_id).toBe(tableRow1.id)

    await app.service('row').remove(tableRow1.id)
    // await app.service('process-run').remove(allExecutions[0].id)
    await app.service('process').remove(processTriggerCreateRow.id)
  })

  it('trigger UPDATE_ROW if process triggers is enabled and well configured - Bulk request', async () => {
    expect.assertions(4)

    const processTriggerCreateRow = await app.service('process').create({
      table_id: table1.id,
      trigger: ProcessTrigger.UPDATE_ROW,
      enabled: true,
    }) as Process
    tableRow1 = await app.service('row').create({
      text: 'yo',
      table_id: table1.id,
      data: {
        [tableColumn.id]: 'This is a string',
        [tableColumn1.id]: 'This is another string',
      },
    })
    tableRow2 = await app.service('row').create({
      text: 'yo',
      table_id: table1.id,
      data: {
        [tableColumn.id]: 'This is a string',
        [tableColumn1.id]: 'This is another string',
      },
    })
    let allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]
    expect(allExecutions.length).toBe(0)

    await app.service('row').patch(null, {
      data: {
        [tableFormulaColumn.id]: 20,
      },
    },
    {
      query: {
        'table_row.id': {
          $in: [tableRow1.id, tableRow2.id],
        },
        table_id: table1.id,
      },
    })

    allExecutions = await app.service('process-run').find({
      paginate: false,
    }) as ProcessRun[]

    const firstProcessRun = await app.service('process-run').find({
      query: {
        process_id: processTriggerCreateRow.id,
        table_row_id: tableRow1.id,
      },
    }) as Paginated<ProcessRun>
    const secondProcessRun = await app.service('process-run').find({
      query: {
        process_id: processTriggerCreateRow.id,
        table_row_id: tableRow2.id,
      },
    }) as Paginated<ProcessRun>

    expect(allExecutions.length).toBe(2)
    expect(firstProcessRun.total).toBe(1)
    expect(secondProcessRun.total).toBe(1)

    await app.service('row').remove(tableRow1.id)
    await app.service('row').remove(tableRow2.id)
    await app.service('process').remove(processTriggerCreateRow.id)
  })

  afterEach(async () => {
    await app.service('column').remove(tableColumn1.id)
    await app.service('column').remove(tableColumn.id)
    await app.service('column').remove(tableFormulaColumn.id)
    await app.service('table').remove(table1.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })

  afterAll(async () => {
    axios.post = originalAxiosPost
  })
})
