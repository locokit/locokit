import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'

describe('enhanceComplexColumns hook', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let table2: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let user1: User
  let rowTable1: TableRow
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
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1-enhancecomplexcolumns@locokit.io',
      password: 'locokit',
    })
  })

  it('enhance the user data field with the user name in value when creating a row with a USER column type', async () => {
    const service = app.service('row')
    rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {
        [columnTable1User.id]: user1.id,
      },
    })
    expect.assertions(3)
    expect(rowTable1).toBeTruthy()
    expect((rowTable1.data[columnTable1User.id] as { reference: string, value: string }).value).toBe('User 1')
    expect((rowTable1.data[columnTable1User.id] as { reference: string, value: string }).reference).toBe(user1.id)
  })
  it('enhance the relation data field with the relation table in value when creating a row with a USER column type', async () => {
    const service = app.service('row')
    rowTable2 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref',
      data: {
        [columnTable2RelationBetweenTable1.id]: rowTable1.id,
      },
    })
    expect.assertions(3)
    expect(rowTable2).toBeTruthy()
    expect((rowTable2.data[columnTable2RelationBetweenTable1.id] as { reference: string, value: string }).value).toBe('table 1 ref')
    expect((rowTable2.data[columnTable2RelationBetweenTable1.id] as { reference: string, value: string }).reference).toBe(rowTable1.id)
  })
  it('enhance the user data field with the users names in value when creating a row with a MULTI_USER column type', async () => {
    const service = app.service('row')
    rowTable3 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref multi',
      data: {
        [columnTable1MultiUser.id]: [user1.id],
      },
    })
    expect.assertions(3)
    expect(rowTable3).toBeTruthy()
    expect((rowTable3.data[columnTable1MultiUser.id] as { reference: string, value: string }).value).toEqual(['User 1'])
    expect((rowTable3.data[columnTable1MultiUser.id] as { reference: string, value: string }).reference).toEqual([user1.id])
  })
  afterAll(async () => {
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(rowTable1.id)
    await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
  })
})
