import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { workspace } from '../../models/workspace.model'

const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'

describe('fillLookedUpColumnInTableRowData hook', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable1SingleSelect: TableColumn
  let columnTable1MultiSelect: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let columnTable2LookedUpColumnTable1MultiUser: TableColumn
  let columnTable2LookedUpColumnTable1Ref: TableColumn
  let columnTable2LookedUpColumnTable1SingleSelect: TableColumn
  let columnTable2LookedUpColumnTable1MultiSelect: TableColumn
  let user1: User
  let user2: User
  let rowTable1: TableRow
  let rowTable2: TableRow
  let rowTable3: TableRow
  let rowTable4: TableRow
  let rowTable5: TableRow

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
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
      text: 'Multi User',
      column_type_id: COLUMN_TYPE.MULTI_USER,
      table_id: table1.id,
    })
    columnTable1SingleSelect = await app.service('column').create({
      text: 'SingleSelect',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1',
          },
          [singleSelectOption2UUID]: {
            label: 'option 2',
          },
          [singleSelectOption3UUID]: {
            label: 'option 3',
          },
        },
      },
    })
    columnTable1MultiSelect = await app.service('column').create({
      text: 'MultiSelect',
      column_type_id: COLUMN_TYPE.MULTI_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1',
          },
          [singleSelectOption2UUID]: {
            label: 'option 2',
          },
          [singleSelectOption3UUID]: {
            label: 'option 3',
          },
        },
      },
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
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1-updt-lkdp-column1@locokit.io',
      password: 'locokit',
    })
    user2 = await app.service('user').create({
      name: 'User 2',
      email: 'user1-updt-lkdp-column2@locokit.io',
      password: 'locokit',
    })
  })

  beforeEach(async () => {
    const service = app.service('row')
    rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref 1',
      data: {
        [columnTable1Ref.id]: 'ref 1 with " and others " for injection',
        [columnTable1User.id]: user1.id,
        [columnTable1MultiUser.id]: [user1.id, user2.id],
        [columnTable1SingleSelect.id]: singleSelectOption1UUID,
        [columnTable1MultiSelect.id]: [singleSelectOption1UUID, singleSelectOption3UUID],
      },
    })
    rowTable2 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref 2',
      data: {
        [columnTable1Ref.id]: 'ref 2',
        [columnTable1User.id]: user2.id,
        [columnTable1MultiUser.id]: [user2.id],
        [columnTable1SingleSelect.id]: singleSelectOption2UUID,
        [columnTable1MultiSelect.id]: [singleSelectOption3UUID, singleSelectOption2UUID],
      },
    })
    rowTable3 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref 1',
      data: {
        [columnTable2RelationBetweenTable1.id]: rowTable1.id,
      },
    })
    rowTable4 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref 2',
      data: {
        [columnTable2RelationBetweenTable1.id]: rowTable2.id,
      },
    })
    rowTable5 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref 3',
      data: {
        [columnTable2RelationBetweenTable1.id]: null,
      },
    })
  })
  it('fill all rows with the matching data from the foreign column of the matching rows (user)', async () => {
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
    const newRowTable3 = await app.service('row').get(rowTable3.id)
    const newRowTable4 = await app.service('row').get(rowTable4.id)
    const newRowTable5 = await app.service('row').get(rowTable5.id)

    expect.assertions(3)
    expect(newRowTable3.data[columnTable2LookedUpColumnTable1User.id]).toStrictEqual({
      reference: user1.id,
      value: 'User 1',
    })
    expect(newRowTable4.data[columnTable2LookedUpColumnTable1User.id]).toStrictEqual({
      reference: user2.id,
      value: 'User 2',
    })
    expect(newRowTable5.data[columnTable2LookedUpColumnTable1User.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
  })
  it('fill all rows with the matching data from the foreign column of the matching rows (multi user)', async () => {
    columnTable2LookedUpColumnTable1MultiUser = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiUser.id,
      },
    })
    const newRowTable3 = await app.service('row').get(rowTable3.id)
    const newRowTable4 = await app.service('row').get(rowTable4.id)
    const newRowTable5 = await app.service('row').get(rowTable5.id)

    expect.assertions(3)
    expect(newRowTable3.data[columnTable2LookedUpColumnTable1MultiUser.id]).toStrictEqual({
      reference: [user1.id, user2.id],
      value: 'User 1, User 2',
    })
    expect(newRowTable4.data[columnTable2LookedUpColumnTable1MultiUser.id]).toStrictEqual({
      reference: [user2.id],
      value: 'User 2',
    })
    expect(newRowTable5.data[columnTable2LookedUpColumnTable1MultiUser.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1MultiUser.id)
  })
  it('fill all rows with the matching data from the foreign column of the matching rows (string)', async () => {
    columnTable2LookedUpColumnTable1Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Ref.id,
      },
    })
    const newRowTable3 = await app.service('row').get(rowTable3.id)
    const newRowTable4 = await app.service('row').get(rowTable4.id)
    const newRowTable5 = await app.service('row').get(rowTable5.id)

    expect.assertions(3)
    expect(newRowTable3.data[columnTable2LookedUpColumnTable1Ref.id]).toStrictEqual({
      reference: rowTable1.id,
      value: 'ref 1 with " and others " for injection',
    })
    expect(newRowTable4.data[columnTable2LookedUpColumnTable1Ref.id]).toStrictEqual({
      reference: rowTable2.id,
      value: 'ref 2',
    })
    expect(newRowTable5.data[columnTable2LookedUpColumnTable1Ref.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1Ref.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (single select)', async () => {
    columnTable2LookedUpColumnTable1SingleSelect = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1SingleSelect.id,
      },
    })
    const newRowTable3 = await app.service('row').get(rowTable3.id)
    const newRowTable4 = await app.service('row').get(rowTable4.id)
    const newRowTable5 = await app.service('row').get(rowTable5.id)

    expect.assertions(3)
    expect(newRowTable3.data[columnTable2LookedUpColumnTable1SingleSelect.id]).toStrictEqual({
      reference: rowTable1.id,
      value: 'option 1',
    })
    expect(newRowTable4.data[columnTable2LookedUpColumnTable1SingleSelect.id]).toStrictEqual({
      reference: rowTable2.id,
      value: 'option 2',
    })
    expect(newRowTable5.data[columnTable2LookedUpColumnTable1SingleSelect.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1SingleSelect.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (multi select)', async () => {
    columnTable2LookedUpColumnTable1MultiSelect = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiSelect.id,
      },
    })
    const newRowTable3 = await app.service('row').get(rowTable3.id)
    const newRowTable4 = await app.service('row').get(rowTable4.id)
    const newRowTable5 = await app.service('row').get(rowTable5.id)

    expect.assertions(3)
    expect(newRowTable3.data[columnTable2LookedUpColumnTable1MultiSelect.id]).toStrictEqual({
      reference: rowTable1.id,
      value: [singleSelectOption1UUID, singleSelectOption3UUID],
    })
    expect(newRowTable4.data[columnTable2LookedUpColumnTable1MultiSelect.id]).toStrictEqual({
      reference: rowTable2.id,
      value: [singleSelectOption3UUID, singleSelectOption2UUID],
    })
    expect(newRowTable5.data[columnTable2LookedUpColumnTable1MultiSelect.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1MultiSelect.id)
  })

  afterEach(async () => {
    await app.service('row').remove(rowTable5.id)
    await app.service('row').remove(rowTable4.id)
    await app.service('row').remove(rowTable3.id)
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(rowTable1.id)
  })

  afterAll(async () => {
    await app.service('user').remove(user2.id)
    await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
