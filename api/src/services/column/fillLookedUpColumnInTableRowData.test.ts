import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'
import { LckAclSet } from '../../models/aclset.model'
import { Group } from '../../models/group.model'
import { dropWorkspace } from '../../utils/dropWorkspace'

const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'

describe('fillLookedUpColumnInTableRowData hook', () => {
  let workspace: Workspace
  let acl: LckAclSet
  let database: Database
  let table1: Table
  let table2: Table
  let table3: Table
  let columnTable1Ref: TableColumn
  let columnTable1Number: TableColumn
  let columnTable1Date: TableColumn
  let columnTable1Float: TableColumn
  let columnTable1Text: TableColumn
  let columnTable1URL: TableColumn
  let columnTable1Formula: TableColumn
  let columnTable1Boolean: TableColumn
  let columnTable1User: TableColumn
  let columnTable1Group: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable1SingleSelect: TableColumn
  let columnTable1MultiSelect: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let columnTable2LookedUpColumnTable1Group: TableColumn
  let columnTable2LookedUpColumnTable1MultiUser: TableColumn
  let columnTable2LookedUpColumnTable1Ref: TableColumn
  let columnTable2LookedUpColumnTable1SingleSelect: TableColumn
  let columnTable2LookedUpColumnTable1: TableColumn
  let columnTable2LookedUpColumnTable1MultiSelect: TableColumn
  let columnTable3RelationBetweenTable2: TableColumn
  let columnTable3LookedUpColumnTable2LookUpColumn: TableColumn
  let columnTable3LookedUpColumnTable2RelationBetweenTable: TableColumn
  let user1: User
  let user2: User
  let group1: Group
  let group2: Group
  let row1Table1: TableRow
  let row2Table1: TableRow
  let row1Table2: TableRow
  let row2Table2: TableRow
  let row3Table2: TableRow
  let row1Table3: TableRow
  let row2Table3: TableRow
  let row3Table3: TableRow

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    acl = await app.service('aclset').create({
      workspace_id: workspace.id,
      label: 'ACL Workspace pouet',
    })
    const database = workspaceDatabases.data[0]
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
    columnTable1Number = await app.service('column').create({
      text: 'Number',
      column_type_id: COLUMN_TYPE.NUMBER,
      table_id: table1.id,
    })
    columnTable1Date = await app.service('column').create({
      text: 'Date',
      column_type_id: COLUMN_TYPE.DATE,
      table_id: table1.id,
    })
    columnTable1Float = await app.service('column').create({
      text: 'Float',
      column_type_id: COLUMN_TYPE.FLOAT,
      table_id: table1.id,
    })
    columnTable1Text = await app.service('column').create({
      text: 'Text',
      column_type_id: COLUMN_TYPE.TEXT,
      table_id: table1.id,
    })
    columnTable1URL = await app.service('column').create({
      text: 'URL',
      column_type_id: COLUMN_TYPE.URL,
      table_id: table1.id,
    })
    columnTable1Boolean = await app.service('column').create({
      text: 'Boolean',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id,
    })
    columnTable1Formula = await app.service('column').create({
      text: 'Formula',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: `COLUMN.{${columnTable1Number.id}}`,
      },
    })
    columnTable1User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id,
    })
    columnTable1Group = await app.service('column').create({
      text: 'Group',
      column_type_id: COLUMN_TYPE.GROUP,
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
      text: 'RBT to Table1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    columnTable3RelationBetweenTable2 = await app.service('column').create({
      text: 'RBT to Table2',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
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
    group1 = await app.service('group').create({
      name: 'Group 1',
      aclset_id: acl.id,
    })
    group2 = await app.service('group').create({
      name: 'Group 2',
      aclset_id: acl.id,
    })
  })

  beforeEach(async () => {
    const service = app.services.row
    row1Table1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref 1',
      data: {
        [columnTable1Ref.id]: 'ref 1 with " and others " for injection',
        [columnTable1User.id]: user1.id,
        [columnTable1MultiUser.id]: [user1.id, user2.id],
        [columnTable1SingleSelect.id]: singleSelectOption1UUID,
        [columnTable1MultiSelect.id]: [singleSelectOption1UUID, singleSelectOption3UUID],
        [columnTable1Number.id]: 10,
        [columnTable1Date.id]: '2021-05-30',
        [columnTable1Float.id]: 10.2,
        [columnTable1Text.id]: 'text 1',
        [columnTable1URL.id]: 'https://myurl1.mydomain',
        [columnTable1Boolean.id]: true,
        [columnTable1Group.id]: group1.id,
      },
    })
    row2Table1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref 2',
      data: {
        [columnTable1Ref.id]: 'ref 2',
        [columnTable1User.id]: user2.id,
        [columnTable1MultiUser.id]: [user2.id],
        [columnTable1SingleSelect.id]: singleSelectOption2UUID,
        [columnTable1MultiSelect.id]: [singleSelectOption3UUID, singleSelectOption2UUID],
        [columnTable1Number.id]: 15,
        [columnTable1Date.id]: '2021-05-25',
        [columnTable1Float.id]: 15.2,
        [columnTable1Text.id]: 'text 2',
        [columnTable1URL.id]: 'https://myurl2.mydomain',
        [columnTable1Boolean.id]: true,
        [columnTable1Group.id]: group2.id,
      },
    })
    row1Table2 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref 1',
      data: {
        [columnTable2RelationBetweenTable1.id]: row1Table1.id,
      },
    })
    row2Table2 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref 2',
      data: {
        [columnTable2RelationBetweenTable1.id]: row2Table1.id,
      },
    })
    row3Table2 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref 3',
      data: {
        [columnTable2RelationBetweenTable1.id]: null,
      },
    })
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (user)', async () => {
    columnTable2LookedUpColumnTable1User = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1User.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1User.id]).toStrictEqual({
      reference: user1.id,
      value: 'User 1',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1User.id]).toStrictEqual({
      reference: user2.id,
      value: 'User 2',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1User.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (group)', async () => {
    columnTable2LookedUpColumnTable1Group = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Group.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1Group.id]).toStrictEqual({
      reference: group1.id,
      value: 'Group 1',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1Group.id]).toStrictEqual({
      reference: group2.id,
      value: 'Group 2',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1Group.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1Group.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (multi user)', async () => {
    columnTable2LookedUpColumnTable1MultiUser = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiUser.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    // order may change
    if (newRow1Table2.data[columnTable2LookedUpColumnTable1MultiUser.id].reference[0] === user1.id) {
      expect(newRow1Table2.data[columnTable2LookedUpColumnTable1MultiUser.id]).toStrictEqual({
        reference: [user1.id, user2.id],
        value: 'User 1, User 2',
      })
    } else {
      expect(newRow1Table2.data[columnTable2LookedUpColumnTable1MultiUser.id]).toStrictEqual({
        reference: [user2.id, user1.id],
        value: 'User 2, User 1',
      })
    }
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1MultiUser.id]).toStrictEqual({
      reference: [user2.id],
      value: 'User 2',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1MultiUser.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1MultiUser.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (string)', async () => {
    columnTable2LookedUpColumnTable1Ref = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Ref.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1Ref.id]).toStrictEqual({
      reference: row1Table1.id,
      value: 'ref 1 with " and others " for injection',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1Ref.id]).toStrictEqual({
      reference: row2Table1.id,
      value: 'ref 2',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1Ref.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1Ref.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (number)', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      text: 'New Ref 1',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Number.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row1Table1.id,
      value: '10',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row2Table1.id,
      value: '15',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (date)', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Date.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row1Table1.id,
      value: '2021-05-30',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row2Table1.id,
      value: '2021-05-25',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (float)', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Float.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row1Table1.id,
      value: '10.2',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row2Table1.id,
      value: '15.2',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (text)', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Text.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row1Table1.id,
      value: 'text 1',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row2Table1.id,
      value: 'text 2',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (url)', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1URL.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row1Table1.id,
      value: 'https://myurl1.mydomain',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row2Table1.id,
      value: 'https://myurl2.mydomain',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (formula)', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Formula.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row1Table1.id,
      value: '10',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row2Table1.id,
      value: '15',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (boolean)', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Boolean.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row1Table1.id,
      value: 'true',
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1.id]).toStrictEqual({
      reference: row2Table1.id,
      value: 'true',
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (single select)', async () => {
    columnTable2LookedUpColumnTable1SingleSelect = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1SingleSelect.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1SingleSelect.id]).toStrictEqual({
      reference: row1Table1.id,
      value: singleSelectOption1UUID,
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1SingleSelect.id]).toStrictEqual({
      reference: row2Table1.id,
      value: singleSelectOption2UUID,
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1SingleSelect.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1SingleSelect.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (multi select)', async () => {
    columnTable2LookedUpColumnTable1MultiSelect = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiSelect.id,
      },
    })
    const newRow1Table2 = await app.services.row.get(row1Table2.id)
    const newRow2Table2 = await app.services.row.get(row2Table2.id)
    const newRow3Table2 = await app.services.row.get(row3Table2.id)

    expect.assertions(3)
    expect(newRow1Table2.data[columnTable2LookedUpColumnTable1MultiSelect.id]).toStrictEqual({
      reference: row1Table1.id,
      value: [singleSelectOption1UUID, singleSelectOption3UUID],
    })
    expect(newRow2Table2.data[columnTable2LookedUpColumnTable1MultiSelect.id]).toStrictEqual({
      reference: row2Table1.id,
      value: [singleSelectOption3UUID, singleSelectOption2UUID],
    })
    expect(newRow3Table2.data[columnTable2LookedUpColumnTable1MultiSelect.id]).toBe(null)

    await app.service('column').remove(columnTable2LookedUpColumnTable1MultiSelect.id)
  })

  it('fill all rows with the matching data from the foreign column of the matching rows (relation between tables)', async () => {
    // Create table 3 rows
    row1Table3 = await app.service('row').create({
      table_id: table3.id,
      text: 'table 3 ref 1',
      data: {
        [columnTable3RelationBetweenTable2.id]: row1Table2.id,
      },
    })
    row2Table3 = await app.service('row').create({
      table_id: table3.id,
      text: 'table 3 ref 2',
      data: {
        [columnTable3RelationBetweenTable2.id]: row2Table2.id,
      },
    })
    row3Table3 = await app.service('row').create({
      table_id: table3.id,
      text: 'table 3 ref 3',
      data: {
        [columnTable3RelationBetweenTable2.id]: null,
      },
    })

    // Create the column
    columnTable3LookedUpColumnTable2RelationBetweenTable = await app.service('column').create({
      text: 'New Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
        localField: columnTable3RelationBetweenTable2.id,
        foreignField: columnTable2RelationBetweenTable1.id,
      },
    })

    // Check that the values of the table rows for this new column are well initialized
    const newRow1Table3 = await app.services.row.get(row1Table3.id)
    const newRow2Table3 = await app.services.row.get(row2Table3.id)
    const newRow3Table3 = await app.services.row.get(row3Table3.id)

    expect.assertions(3)
    expect(newRow1Table3.data[columnTable3LookedUpColumnTable2RelationBetweenTable.id]).toStrictEqual({
      reference: row1Table2.id,
      value: (row1Table2.data[columnTable2RelationBetweenTable1.id] as { reference: string, value: string }).value,
    })
    expect(newRow2Table3.data[columnTable3LookedUpColumnTable2RelationBetweenTable.id]).toStrictEqual({
      reference: row2Table2.id,
      value: (row2Table2.data[columnTable2RelationBetweenTable1.id] as { reference: string, value: string }).value,
    })
    expect(newRow3Table3.data[columnTable3LookedUpColumnTable2RelationBetweenTable.id]).toBe(null)

    // Clean database
    await app.service('column').remove(columnTable3LookedUpColumnTable2RelationBetweenTable.id)
    await app.services.row.remove(row3Table3.id)
    await app.services.row.remove(row2Table3.id)
    await app.services.row.remove(row1Table3.id)
  })

  describe('Fill all rows with the matching data from the foreign column of the matching rows (looked up column)', () => {
    beforeEach(async () => {
      const service = app.services.row
      row1Table3 = await service.create({
        table_id: table3.id,
        text: 'table 3 ref 1',
        data: {
          [columnTable3RelationBetweenTable2.id]: row1Table2.id,
        },
      })
      row2Table3 = await service.create({
        table_id: table3.id,
        text: 'table 3 ref 2',
        data: {
          [columnTable3RelationBetweenTable2.id]: row2Table2.id,
        },
      })
      row3Table3 = await service.create({
        table_id: table3.id,
        text: 'table 3 ref 3',
        data: {
          [columnTable3RelationBetweenTable2.id]: null,
        },
      })
    })

    afterEach(async () => {
      await app.services.row.remove(row3Table3.id)
      await app.services.row.remove(row2Table3.id)
      await app.services.row.remove(row1Table3.id)
      await app.service('column').remove(columnTable3LookedUpColumnTable2LookUpColumn.id)
      await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
    })

    it('from an original column : user', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1User.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: user1.id,
        value: 'User 1',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: user2.id,
        value: 'User 2',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : number', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Number.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: '10',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: '15',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : date', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Date.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: '2021-05-30',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: '2021-05-25',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : float', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Float.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: '10.2',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: '15.2',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : text', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Text.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: 'text 1',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: 'text 2',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : url', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1URL.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: 'https://myurl1.mydomain',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: 'https://myurl2.mydomain',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : boolean', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Boolean.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: 'true',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: 'true',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : formula', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Formula.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: '10',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: '15',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : multi user', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1MultiUser.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      // order may change
      if (newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id].reference[0] === user1.id) {
        expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
          reference: [user1.id, user2.id],
          value: 'User 1, User 2',
        })
      } else {
        expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
          reference: [user2.id, user1.id],
          value: 'User 2, User 1',
        })
      }
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: [user2.id],
        value: 'User 2',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : string', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Ref.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: 'ref 1 with " and others " for injection',
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: 'ref 2',
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : single select', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1SingleSelect.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: singleSelectOption1UUID,
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: singleSelectOption2UUID,
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })

    it('from an original column : multi select', async () => {
      columnTable2LookedUpColumnTable1 = await app.service('column').create({
        text: 'New Ref 1',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1MultiSelect.id,
        },
      })
      columnTable3LookedUpColumnTable2LookUpColumn = await app.service('column').create({
        text: 'New Ref 2',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        settings: {
          tableId: table2.id,
          localField: columnTable3RelationBetweenTable2.id,
          foreignField: columnTable2LookedUpColumnTable1.id,
        },
      })
      const newRow1Table3 = await app.services.row.get(row1Table3.id)
      const newRow2Table3 = await app.services.row.get(row2Table3.id)
      const newRow3Table3 = await app.services.row.get(row3Table3.id)

      expect.assertions(3)
      expect(newRow1Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row1Table2.id,
        value: [singleSelectOption1UUID, singleSelectOption3UUID],
      })
      expect(newRow2Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toStrictEqual({
        reference: row2Table2.id,
        value: [singleSelectOption3UUID, singleSelectOption2UUID],
      })
      expect(newRow3Table3.data[columnTable3LookedUpColumnTable2LookUpColumn.id]).toBe(null)
    })
  })

  afterEach(async () => {
    await app.services.row.remove(row3Table2.id)
    await app.services.row.remove(row2Table2.id)
    await app.services.row.remove(row1Table2.id)
    await app.services.row.remove(row2Table1.id)
    await app.services.row.remove(row1Table1.id)
  })

  afterAll(async () => {
    await app.services.group.remove(group2.id)
    await app.services.group.remove(group1.id)
    await app.services.user.remove(user2.id)
    await app.services.user.remove(user1.id)
    await app.services.column.remove(columnTable1User.id)
    await app.services.column.remove(columnTable1MultiUser.id)
    await app.services.column.remove(columnTable1SingleSelect.id)
    await app.services.column.remove(columnTable1MultiSelect.id)
    await app.services.column.remove(columnTable1Formula.id)
    await app.services.column.remove(columnTable1Number.id)
    await app.services.column.remove(columnTable1Date.id)
    await app.services.column.remove(columnTable1Float.id)
    await app.services.column.remove(columnTable1Text.id)
    await app.services.column.remove(columnTable1URL.id)
    await app.services.column.remove(columnTable1Boolean.id)
    await app.services.column.remove(columnTable1Ref.id)
    await app.services.column.remove(columnTable1Group.id)
    await app.services.column.remove(columnTable2Ref.id)
    await app.services.column.remove(columnTable2RelationBetweenTable1.id)
    await app.services.column.remove(columnTable3RelationBetweenTable2.id)
    await app.services.table.remove(table3.id)
    await app.services.table.remove(table2.id)
    await app.services.table.remove(table1.id)
    await dropWorkspace(app, workspace.id)
  })
})
