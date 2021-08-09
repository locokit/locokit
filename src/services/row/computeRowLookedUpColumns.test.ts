import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'

describe('computeRowLookedUpColumns hook', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let table2: Table
  let table3: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2RelationBetweenTable1Bis: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let columnTable2LookedUpColumnTable1MultiUser: TableColumn
  let columnTable2LookedUpColumnTable1UserBis: TableColumn
  let columnTable3LookedUpColumnTable1RBT2: TableColumn
  let columnTable3RelationBetweenTable2: TableColumn
  let user1: User
  let rowTable1: TableRow
  let rowTable1Bis: TableRow
  let rowTable2: TableRow
  let rowTable3: TableRow

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
    table3 = await app.service('table').create({
      text: 'table3',
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
    columnTable1MultiUser = await app.service('column').create({
      text: 'MultiUser',
      column_type_id: COLUMN_TYPE.MULTI_USER,
      table_id: table1.id,
    })
    columnTable2Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    columnTable2RelationBetweenTable1 = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    columnTable2RelationBetweenTable1Bis = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    columnTable2LookedUpColumnTable1User = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1User.id,
      },
    })
    columnTable2LookedUpColumnTable1MultiUser = await app.service('column').create({
      text: 'RefMulti',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiUser.id,
      },
    })
    columnTable2LookedUpColumnTable1UserBis = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1Bis.id,
        foreignField: columnTable1User.id,
      },
    })
    columnTable3RelationBetweenTable2 = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
      },
    })
    columnTable3LookedUpColumnTable1RBT2 = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
        localField: columnTable3RelationBetweenTable2.id,
        foreignField: columnTable2RelationBetweenTable1.id,
      },
    })

    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1-row-lkdpup@locokit.io',
      password: 'locokit',
    })
  })

  beforeEach(async () => {
    const service = app.service('row')
    rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {
        [columnTable1User.id]: user1.id,
        [columnTable1MultiUser.id]: [user1.id],
      },
    })
    rowTable1Bis = await service.create({
      table_id: table1.id,
      text: 'table 1 ref bis',
      data: {
        [columnTable1User.id]: user1.id,
        [columnTable1MultiUser.id]: [user1.id],
      },
    })
    rowTable2 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref',
    })
    rowTable3 = await service.create({
      table_id: table3.id,
      text: 'table 3 ref',
    })
  })

  it('compute the lookedup column of the currentRow', async () => {
    expect.assertions(11)
    const spyOnGetForeignColumn = jest.spyOn(app.service('column'), 'get').mockClear()
    expect(rowTable2.data[columnTable2RelationBetweenTable1.id]).toBeNull()
    // Update the relation between tables value
    let newRowTable2 = await app.service('row').patch(rowTable2.id, {
      data: {
        [columnTable2RelationBetweenTable1.id]: rowTable1.id,
      },
    })
    expect(spyOnGetForeignColumn).toHaveBeenCalledTimes(2)
    expect(newRowTable2.data[columnTable2RelationBetweenTable1.id].reference).toBe(rowTable1.id)
    expect(newRowTable2.data[columnTable2RelationBetweenTable1.id].value).toBe('table 1 ref')
    expect(newRowTable2.data[columnTable2LookedUpColumnTable1User.id].value).toBe('User 1')
    expect(newRowTable2.data[columnTable2LookedUpColumnTable1User.id].reference).toBe(user1.id)
    expect(newRowTable2.data[columnTable2LookedUpColumnTable1MultiUser.id].value).toBe('User 1')
    expect(newRowTable2.data[columnTable2LookedUpColumnTable1MultiUser.id].reference).toEqual([user1.id])

    // Reset the relation between tables value
    newRowTable2 = await app.service('row').patch(rowTable2.id, {
      data: {
        [columnTable2RelationBetweenTable1.id]: null,
      },
    })
    expect(newRowTable2.data[columnTable2RelationBetweenTable1.id]).toBeNull()
    expect(newRowTable2.data[columnTable2LookedUpColumnTable1User.id]).toBeNull()
    expect(newRowTable2.data[columnTable2LookedUpColumnTable1MultiUser.id]).toBeNull()

    // Check the update of a LOOKED_UP_COLUMN linked to a RELATION_BETWEEN_TABLES column
    spyOnGetForeignColumn.mockClear()
    const newRowTable3 = await app.service('row').patch(rowTable3.id, {
      data: {
        [columnTable3RelationBetweenTable2.id]: newRowTable2.id,
      },
    })
    expect(spyOnGetForeignColumn).toHaveBeenCalledTimes(1)
    expect(newRowTable3.data[columnTable3LookedUpColumnTable1RBT2.id].reference).toBe(newRowTable2.id)
    expect(newRowTable3.data[columnTable3LookedUpColumnTable1RBT2.id].value).toBe('table 1 ref')

    // Clean DB
    await app.service('row').remove(newRowTable3.id)
  })

  it('do not compute the lookedup columns of the current row which are not related to the updated data', async () => {
    expect.assertions(6)
    const spyOnGetForeignColumn = jest.spyOn(app.service('column'), 'get').mockClear()
    expect(rowTable2.data[columnTable2RelationBetweenTable1Bis.id]).toBeNull()
    const newRowTable2 = await app.service('row').patch(rowTable2.id, {
      data: {
        [columnTable2RelationBetweenTable1Bis.id]: rowTable1.id,
      },
    })
    expect(spyOnGetForeignColumn).toHaveBeenCalledTimes(1)
    expect(newRowTable2.data[columnTable2RelationBetweenTable1Bis.id].reference).toBe(rowTable1.id)
    expect(newRowTable2.data[columnTable2RelationBetweenTable1Bis.id].value).toBe('table 1 ref')
    expect(newRowTable2.data[columnTable2LookedUpColumnTable1UserBis.id].value).toBe('User 1')
    expect(newRowTable2.data[columnTable2LookedUpColumnTable1UserBis.id].reference).toBe(user1.id)
  })

  afterEach(async () => {
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(rowTable1.id)
    await app.service('row').remove(rowTable1Bis.id)
  })

  afterAll(async () => {
    await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1MultiUser.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1MultiUser.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1UserBis.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1Bis.id)
    await app.service('column').remove(columnTable3LookedUpColumnTable1RBT2.id)
    await app.service('column').remove(columnTable3RelationBetweenTable2.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('table').remove(table3.id)
    await app.service('database').remove(database.id)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
  })
})
