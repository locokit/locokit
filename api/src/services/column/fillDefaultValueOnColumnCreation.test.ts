import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { Paginated } from '@feathersjs/feathers'

import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import { TableRow } from '../../models/tablerow.model'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('fillDefaultValueOnColumnCreation hooks', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let stringColumn1: TableColumn
  let row1Table1: TableRow
  let row2Table1: TableRow

  beforeAll(async () => {
    // Create workspace and database
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
    // Create columns
    stringColumn1 = await app.service('column').create({
      text: 'string_column_1',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    // Create rows
    row1Table1 = await app.service('row').create({
      data: {
        [stringColumn1.id]: 'myFirstRow',
      },
      table_id: table1.id,
    })
    row2Table1 = await app.service('row').create({
      data: {
        [stringColumn1.id]: 'mySecondRow',
      },
      table_id: table1.id,
    })
  })

  afterAll(async () => {
    await app.service('row').remove(row1Table1.id)
    await app.service('row').remove(row2Table1.id)
    await app.service('column').remove(stringColumn1.id)
    await app.service('table').remove(table1.id)
    await dropWorkspace(app, workspace.id)
  })

  describe('Boolean column', () => {
    it('initialize the values of all table rows for this column to false if no default value is specified', async () => {
      expect.assertions(2)
      // Create the new column
      const createdColumn = await app.service('column').create({
        text: 'boolean_column',
        column_type_id: COLUMN_TYPE.BOOLEAN,
        table_id: table1.id,
      })
      const rows = await app.service('row').find({
        query: {
          table_id: table1.id,
        },
        paginate: false,
      }) as TableRow[]
      // Check rows values
      expect(rows[0].data[createdColumn.id]).toBe(false)
      expect(rows[1].data[createdColumn.id]).toBe(false)
      // Clean database
      await app.service('column').remove(createdColumn.id)
    })

    it('initialize the values of all table rows for this column to the default value (false) if specified', async () => {
      expect.assertions(2)
      // Create the new column
      const createdColumn = await app.service('column').create({
        text: 'boolean_column',
        column_type_id: COLUMN_TYPE.BOOLEAN,
        table_id: table1.id,
        settings: {
          default: false,
        },
      })
      const rows = await app.service('row').find({
        query: {
          table_id: table1.id,
        },
        paginate: false,
      }) as TableRow[]
      // Check rows values
      expect(rows[0].data[createdColumn.id]).toBe(false)
      expect(rows[1].data[createdColumn.id]).toBe(false)
      // Clean database
      await app.service('column').remove(createdColumn.id)
    })

    it('initialize the values of all table rows for this column to the default value (true) if specified', async () => {
      expect.assertions(2)
      // Create the new column
      const createdColumn = await app.service('column').create({
        text: 'boolean_column',
        column_type_id: COLUMN_TYPE.BOOLEAN,
        table_id: table1.id,
        settings: {
          default: true,
        },
      })
      const rows = await app.service('row').find({
        query: {
          table_id: table1.id,
        },
        paginate: false,
      }) as TableRow[]
      // Check rows values
      expect(rows[0].data[createdColumn.id]).toBe(true)
      expect(rows[1].data[createdColumn.id]).toBe(true)
      // Clean database
      await app.service('column').remove(createdColumn.id)
    })
  })
})
