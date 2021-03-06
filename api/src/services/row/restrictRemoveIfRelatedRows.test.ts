import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('restrictRemoveIfRelatedRows hook', () => {
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
  let rowTable1: TableRow
  let rowTable2: TableRow

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    database = workspace.databases?.[0] as Database
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
      text: 'LUC to Table1',
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
      email: 'user1-restrict-remove@locokit.io',
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
      },
    })
    rowTable2 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref',
      data: {
        [columnTable2RelationBetweenTable1.id]: rowTable1.id,
      },
    })
  })
  it('restrict the deletion of a row if there is a related row', async () => {
    expect.assertions(1)
    try {
      await app.service('row').remove(rowTable1.id)
    } catch (e) {
      expect(e).toBeTruthy()
    }
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(rowTable1.id)
  })
  it('let the removal execute if deletion are ordered correctly', async () => {
    expect.assertions(4)
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(rowTable1.id)
    try {
      await app.service('row').get(rowTable2.id)
    } catch (e: any) {
      expect(e).toBeTruthy()
      expect(e.code).toBe(404)
    }
    try {
      await app.service('row').get(rowTable1.id)
    } catch (e: any) {
      expect(e).toBeTruthy()
      expect(e.code).toBe(404)
    }
  })

  afterAll(async () => {
    await app.service('user').remove(user1.id)

    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('table').remove(table2.id)

    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('table').remove(table1.id)

    await dropWorkspace(app, workspace.id)
  })
})
