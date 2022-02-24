import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('upsertRowRelation hook', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let table2: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let user1: User
  let row1Table1: TableRow
  let row2Table1: TableRow
  let rowTable2: TableRow

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
      text: 'LUC To Table1',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1User.id,
      },
    })
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1-upsert@locokit.io',
      password: 'locokit',
    })
  })

  beforeEach(async () => {
    const service = app.service('row')
    row1Table1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref A',
      data: {
        [columnTable1User.id]: user1.id,
      },
    })
    row2Table1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref B',
      data: {
        [columnTable1User.id]: user1.id,
      },
    })
    rowTable2 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref',
      data: {
        [columnTable2RelationBetweenTable1.id]: row1Table1.id,
      },
    })
  })
  it('create a relation between 2 rows when columns are related', async () => {
    expect.assertions(2)
    const relation = await app.services.trr._find({
      query: {
        table_row_to_id: rowTable2.id,
        table_column_to_id: columnTable2RelationBetweenTable1.id,
      },
    })
    expect(relation.total).toBe(1)
    expect(relation.data[0].table_row_from_id).toBe(row1Table1.id)
  })
  it('update an existing relation between 2 rows when columns of new rows are related', async () => {
    expect.assertions(2)
    // Update the relation to link another row
    await app.service('row').patch(rowTable2.id, {
      data: {
        [columnTable2RelationBetweenTable1.id]: row2Table1.id,
      },
    })
    const relation = await app.services.trr._find({
      query: {
        table_row_to_id: rowTable2.id,
        table_column_to_id: columnTable2RelationBetweenTable1.id,
      },
    })
    expect(relation.total).toBe(1)
    expect(relation.data[0].table_row_from_id).toBe(row2Table1.id)
  })
  it('reset an existing relation between 2 rows when the related value has been reset', async () => {
    expect.assertions(1)
    // Update the relation to link another row
    await app.service('row').patch(rowTable2.id, {
      data: {
        [columnTable2RelationBetweenTable1.id]: null,
      },
    })
    const relation = await app.services.trr._find({
      query: {
        table_row_to_id: rowTable2.id,
        table_column_to_id: columnTable2RelationBetweenTable1.id,
      },
    })
    expect(relation.total).toBe(0)
  })

  afterEach(async () => {
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(row1Table1.id)
    await app.service('row').remove(row2Table1.id)
  })

  afterAll(async () => {
    await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('column').remove(columnTable2Ref.id)

    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Ref.id)

    await app.service('table').remove(table2.id)
    await app.service('table').remove(table1.id)

    await dropWorkspace(app, workspace.id)
  })
})
