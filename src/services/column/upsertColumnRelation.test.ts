import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'

const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'

describe('upsertColumnRelation hook', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let columnTable1Ref: TableColumn
  let columnTable1SingleSelect: TableColumn
  let columnTable1MultiSelect: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1: TableColumn
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
  })

  beforeEach(async () => {
    rowTable1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 1',
      data: {
        [columnTable1Ref.id]: 'ref 1 with " and others " for injection',
        [columnTable1SingleSelect.id]: singleSelectOption1UUID,
        [columnTable1MultiSelect.id]: [singleSelectOption1UUID, singleSelectOption3UUID],
      },
    })
    rowTable2 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 2',
      data: {
        [columnTable1Ref.id]: 'ref 2',
        [columnTable1SingleSelect.id]: singleSelectOption2UUID,
        [columnTable1MultiSelect.id]: [singleSelectOption3UUID, singleSelectOption2UUID],
      },
    })
    rowTable3 = await app.service('row').create({
      table_id: table2.id,
      text: 'table 2 ref 1',
      data: {
        [columnTable2RelationBetweenTable1.id]: rowTable1.id,
      },
    })
    rowTable4 = await app.service('row').create({
      table_id: table2.id,
      text: 'table 2 ref 2',
      data: {
        [columnTable2RelationBetweenTable1.id]: rowTable2.id,
      },
    })
    rowTable5 = await app.service('row').create({
      table_id: table2.id,
      text: 'table 2 ref 3',
      data: {
        [columnTable2RelationBetweenTable1.id]: null,
      },
    })
  })
  it('create a column relation between a lkdp up column and its foreign field', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      // create the looked up column
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiSelect.id,
      },
    })
    // check the original type of the lkdp up column
    const currentLkdUpColumn = await app.service('column').get(columnTable2LookedUpColumnTable1.id, {
      query: {
        $eager: 'parents.^',
      },
    })
    expect(currentLkdUpColumn).toBeDefined()
    expect(currentLkdUpColumn.parents).toBeDefined()
    expect(currentLkdUpColumn.parents.length).toBe(1)
    expect(currentLkdUpColumn.parents[0].column_type_id).toBe(COLUMN_TYPE.MULTI_SELECT)
    // retrieve rows related to see if data is well filled
    const currentRowTable3 = await app.service('row').get(rowTable3.id)
    const currentRowTable4 = await app.service('row').get(rowTable4.id)
    const currentRowTable5 = await app.service('row').get(rowTable5.id)
    expect(currentRowTable3).toBeDefined()
    expect(currentRowTable4).toBeDefined()
    expect(currentRowTable5).toBeDefined()
    expect(currentRowTable3.data[columnTable2LookedUpColumnTable1.id]).toMatchObject({
      reference: rowTable1.id,
      value: [singleSelectOption1UUID, singleSelectOption3UUID],
    })
    expect(currentRowTable4.data[columnTable2LookedUpColumnTable1.id]).toMatchObject({
      reference: rowTable2.id,
      value: [singleSelectOption3UUID, singleSelectOption2UUID],
    })

    expect(currentRowTable5.data[columnTable2LookedUpColumnTable1.id]).toBeNull()
  })
  it('update a column relation if a foreign field of a lkdp up column is updated', async () => {
    columnTable2LookedUpColumnTable1 = await app.service('column').create({
      // create the looked up column
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiSelect.id,
      },
    })
    // check the original type of the lkdp up column
    const currentLkdUpColumn = await app.service('column').get(columnTable2LookedUpColumnTable1.id, {
      query: {
        $eager: 'parents.^',
      },
    })
    expect(currentLkdUpColumn).toBeDefined()
    expect(currentLkdUpColumn.parents).toBeDefined()
    expect(currentLkdUpColumn.parents.length).toBe(1)
    expect(currentLkdUpColumn.parents[0].column_type_id).toBe(COLUMN_TYPE.MULTI_SELECT)

    // patch lkdp up column
    await app.service('column').patch(columnTable2LookedUpColumnTable1.id, {
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1SingleSelect.id,
      },
    })

    // check the original type of the lkdp up column
    const newLkdpUpColumn = await app.service('column').get(columnTable2LookedUpColumnTable1.id, {
      query: {
        $eager: 'parents.^',
      },
    })
    expect(newLkdpUpColumn).toBeDefined()
    expect(newLkdpUpColumn.parents).toBeDefined()
    expect(newLkdpUpColumn.parents.length).toBe(1)
    expect(newLkdpUpColumn.parents[0].column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)

    // retrieve rows related to see if data is well filled
    const currentRowTable3 = await app.service('row').get(rowTable3.id)
    const currentRowTable4 = await app.service('row').get(rowTable4.id)
    const currentRowTable5 = await app.service('row').get(rowTable5.id)
    expect(currentRowTable3).toBeDefined()
    expect(currentRowTable4).toBeDefined()
    expect(currentRowTable5).toBeDefined()
    expect(currentRowTable3.data[columnTable2LookedUpColumnTable1.id]).toMatchObject({
      reference: rowTable1.id,
      value: 'option 1',
    })
    expect(currentRowTable4.data[columnTable2LookedUpColumnTable1.id]).toMatchObject({
      reference: rowTable2.id,
      value: 'option 2',
    })
    expect(currentRowTable5.data[columnTable2LookedUpColumnTable1.id]).toBeNull()
  })

  afterEach(async () => {
    await app.service('row').remove(rowTable5.id)
    await app.service('row').remove(rowTable4.id)
    await app.service('row').remove(rowTable3.id)
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(rowTable1.id)
  })

  afterAll(async () => {
    await app.service('column').remove(columnTable2LookedUpColumnTable1.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable1MultiSelect.id)
    await app.service('column').remove(columnTable1SingleSelect.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
