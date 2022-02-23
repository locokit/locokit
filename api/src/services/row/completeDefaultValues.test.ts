import { COLUMN_TYPE } from '@locokit/lck-glossary/src'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'
import { TableView } from '../../models/tableview.model'
import { NotAcceptable } from '@feathersjs/errors'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('completeDefaultValues hook', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let table2: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1BooleanWithDefault: TableColumn
  let columnTable1BooleanWithoutDefault: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let rowTable1: TableRow
  let columnTable1FirstName: TableColumn
  let columnTable1LastName: TableColumn
  let columnTable1Type: TableColumn

  beforeAll(async () => {
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
    table2 = await app.service('table').create({
      text: 'table2',
      database_id: database.id,
    })

    columnTable1Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    columnTable1User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id,
    })
    columnTable1BooleanWithoutDefault = await app.service('column').create({
      text: 'Boolean without default',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id,
    })
    columnTable1BooleanWithDefault = await app.service('column').create({
      text: 'Boolean with default',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id,
      settings: {
        default: true,
      },
    })
    columnTable1FirstName = await app.service('column').create({
      text: 'FirstName',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
      reference: true,
      reference_position: 1,
    })
    columnTable1LastName = await app.service('column').create({
      text: 'LastName',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
      reference: true,
      reference_position: 2,
    })
    columnTable1Type = await app.service('column').create({
      text: 'Type',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          '25a3a052-df34-4ef7-b802-772c68be38cd': {
            label: 'Type 1',
          },
          '9f294876-24bb-4081-8a59-d52d2c7e9d92': {
            label: 'Type 2',
          },
        },
        default: '9f294876-24bb-4081-8a59-d52d2c7e9d92',
      },
    })
    columnTable2Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    columnTable2RelationBetweenTable1 = await app.service('column').create({
      text: 'RBT to Table1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    columnTable2LookedUpColumnTable1User = await app.service('column').create({
      text: 'LUC to Table1',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1User.id,
      },
    })
  })

  it('complete all columns for data field', async () => {
    const service = app.service('row')
    const rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {},
    })
    expect.assertions(7)
    const targetKeys = [
      columnTable1Ref.id,
      columnTable1User.id,
      columnTable1BooleanWithoutDefault.id,
      columnTable1BooleanWithDefault.id,
      columnTable1FirstName.id,
      columnTable1LastName.id,
      columnTable1Type.id,
    ]
    Object.keys(rowTable1.data).forEach(key => {
      expect(targetKeys.includes(key)).toBe(true)
    })
    await app.service('row').remove(rowTable1.id)
  })

  it('keep a false boolean value if sent', async () => {
    const service = app.service('row')
    const rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {
        [columnTable1BooleanWithoutDefault.id]: false,
      },
    })
    expect.assertions(1)
    expect(rowTable1.data[columnTable1BooleanWithoutDefault.id]).toBe(false)
    await app.service('row').remove(rowTable1.id)
  })

  it('set a boolean default value to false if not sent', async () => {
    const service = app.service('row')
    const rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {},
    })
    expect.assertions(1)
    expect(rowTable1.data[columnTable1BooleanWithoutDefault.id]).toBe(false)
    await app.service('row').remove(rowTable1.id)
  })

  it('set a boolean default value if specified in the column settings', async () => {
    const service = app.service('row')
    const rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {},
    })
    expect.assertions(1)
    expect(rowTable1.data[columnTable1BooleanWithDefault.id]).toBe(true)
    await app.service('row').remove(rowTable1.id)
  })

  it('set a single select default value', async () => {
    const service = app.service('row')
    const rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {},
    })
    expect.assertions(1)
    expect(rowTable1.data[columnTable1Type.id]).toBe('9f294876-24bb-4081-8a59-d52d2c7e9d92')
    await app.service('row').remove(rowTable1.id)
  })

  it('set a relation between table if injected on a table_view', async () => {
    const view: TableView = await app.service('view').create({
      text: 'View 1',
      table_id: table2.id,
    }) as TableView
    const row1Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 1',
      data: {
        [columnTable1Ref.id]: 'ref1',
      },
    })
    const row2Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 2',
      data: {
        [columnTable1Ref.id]: 'ref2',
      },
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2Ref.id,
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2RelationBetweenTable1.id,
      default: {
        [columnTable1Ref.id]: 'ref1',
      },
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2LookedUpColumnTable1User.id,
    })
    const rowTable2 = await app.service('row').create({
      table_view_id: view.id,
      text: 'table 1 ref',
      data: {},
    })
    expect.assertions(6)
    const targetKeys = [
      columnTable2Ref.id,
      columnTable2RelationBetweenTable1.id,
      columnTable2LookedUpColumnTable1User.id,
    ]
    Object.keys(rowTable2.data).forEach(key => {
      expect(targetKeys.includes(key)).toBe(true)
    })

    expect(rowTable2.data[columnTable2RelationBetweenTable1.id]).toBeDefined()
    expect(rowTable2.data[columnTable2RelationBetweenTable1.id].reference).toBe(row1Table1.id)
    expect(rowTable2.data[columnTable2RelationBetweenTable1.id].value).toBe(row1Table1.text)

    await app.service('view').remove(view.id)
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(row1Table1.id)
    await app.service('row').remove(row2Table1.id)
  })
  it('throw an error if a relation between table if injected on a table_view and no records are found', async () => {
    const view: TableView = await app.service('view').create({
      text: 'View 1',
      table_id: table2.id,
    }) as TableView
    const row1Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 1',
      data: {
        [columnTable1Ref.id]: 'ref1',
      },
    })
    const row2Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 2',
      data: {
        [columnTable1Ref.id]: 'ref2',
      },
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2Ref.id,
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2RelationBetweenTable1.id,
      default: {
        [columnTable1Ref.id]: 'ref3',
      },
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2LookedUpColumnTable1User.id,
    })
    expect.assertions(1)
    await expect(app.service('row').create({
      table_view_id: view.id,
      text: 'table 1 ref',
      data: {},
    })).rejects.toThrow(NotAcceptable)

    await app.service('view').remove(view.id)
    await app.service('row').remove(row1Table1.id)
    await app.service('row').remove(row2Table1.id)
  })
  it('throw an error if a relation between table if injected on a table_view with a {group} filter and no records are found', async () => {
    const view: TableView = await app.service('view').create({
      text: 'View 1',
      table_id: table2.id,
    }) as TableView
    const row1Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 1',
      data: {
        [columnTable1Ref.id]: 'ref1',
      },
    })
    const row2Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 2',
      data: {
        [columnTable1Ref.id]: 'ref2',
      },
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2Ref.id,
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2RelationBetweenTable1.id,
      default: {
        [columnTable1Ref.id]: '{groupId}',
      },
    })
    await app.service('table-view-has-table-column').create({
      table_view_id: view.id,
      table_column_id: columnTable2LookedUpColumnTable1User.id,
    })
    expect.assertions(1)
    await expect(app.service('row').create({
      table_view_id: view.id,
      text: 'table 1 ref',
      data: {},
    })).rejects.toThrow(NotAcceptable)

    await app.service('view').remove(view.id)
    await app.service('row').remove(row1Table1.id)
    await app.service('row').remove(row2Table1.id)
  })

  afterAll(async () => {
    await dropWorkspace(app, workspace.id)
    // await app.service('row').remove(rowTable1.id)
    // await app.service('column').remove(columnTable1Type.id)
    // await app.service('column').remove(columnTable1BooleanWithoutDefault.id)
    // await app.service('column').remove(columnTable1BooleanWithDefault.id)
    // await app.service('column').remove(columnTable1User.id)
    // await app.service('column').remove(columnTable1Ref.id)
    // await app.service('column').remove(columnTable2Ref.id)
    // await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    // await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    // await app.service('table').remove(table1.id)
    // await app.service('table').remove(table2.id)
    // await app.service('database').remove(database.id)
    // // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    // await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    // await app.service('workspace').remove(workspace.id)
  })
})
