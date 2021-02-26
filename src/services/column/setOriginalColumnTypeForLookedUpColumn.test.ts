import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'

const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'

describe('setOriginalColumnTypeForLookedUpColumn hook', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let table3: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1Date: TableColumn
  let columnTable1SingleSelect: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1Ref: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let columnTable2LookedUpColumnTable1Date: TableColumn
  let columnTable2LookedUpColumnTable1SingleSelect: TableColumn
  let columnTable3Ref: TableColumn
  let columnTable3RelationBetweenTable2: TableColumn
  let columnTable3LookedUpColumnTable2Date: TableColumn
  let columnTable3LookedUpColumnTable2SingleSelect: TableColumn

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id
    })
    table2 = await app.service('table').create({
      text: 'table2',
      database_id: database.id
    })
    table3 = await app.service('table').create({
      text: 'table3',
      database_id: database.id
    })
    columnTable1Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id
    })
    columnTable1User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id
    })
    columnTable1Date = await app.service('column').create({
      text: 'Date',
      column_type_id: COLUMN_TYPE.DATE,
      table_id: table1.id
    })
    columnTable1SingleSelect = await app.service('column').create({
      text: 'SingleSelect',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1'
          },
          [singleSelectOption2UUID]: {
            label: 'option 2'
          },
          [singleSelectOption3UUID]: {
            label: 'option 3'
          }
        }
      }
    })
    columnTable2Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id
    })
    columnTable2RelationBetweenTable1 = await app.service('column').create({
      text: 'Table 1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id
      }
    })
    columnTable2LookedUpColumnTable1Ref = await app.service('column').create({
      text: 'Ref Table 1',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Ref.id
      }
    })
    columnTable2LookedUpColumnTable1User = await app.service('column').create({
      text: 'User Table 1',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1User.id
      }
    })
    columnTable2LookedUpColumnTable1Date = await app.service('column').create({
      text: 'Date Table 1',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1Date.id
      }
    })
    columnTable2LookedUpColumnTable1SingleSelect = await app.service('column').create({
      text: 'Single select Table 1',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1SingleSelect.id
      }
    })
    columnTable3Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table3.id
    })
    columnTable3RelationBetweenTable2 = await app.service('column').create({
      text: 'Table 2',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table3.id,
      settings: {
        tableId: table2.id
      }
    })
    columnTable3LookedUpColumnTable2Date = await app.service('column').create({
      text: 'Date Table 2',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
        localField: columnTable3RelationBetweenTable2.id,
        foreignField: columnTable2LookedUpColumnTable1Date.id
      }
    })
    columnTable3LookedUpColumnTable2SingleSelect = await app.service('column').create({
      text: 'Single select  Table 2',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
        localField: columnTable3RelationBetweenTable2.id,
        foreignField: columnTable2LookedUpColumnTable1SingleSelect.id
      }
    })
  })

  it('set the original column for a looked up column defined on a simple type (string)', async () => {
    const column = await app.service('column').get(columnTable2LookedUpColumnTable1Ref.id)

    expect.assertions(2)
    expect(column).toBeDefined()
    expect(column.originalColumn?.column_type_id).toBe(COLUMN_TYPE.STRING)
  })

  it('set the original column for a looked up column defined on a simple type (date)', async () => {
    const column = await app.service('column').get(columnTable2LookedUpColumnTable1Date.id)

    expect.assertions(2)
    expect(column).toBeDefined()
    expect(column.originalColumn?.column_type_id).toBe(COLUMN_TYPE.DATE)
  })
  it('set the original column for a looked up column defined on a single select', async () => {
    const column = await app.service('column').get(columnTable2LookedUpColumnTable1SingleSelect.id)

    expect.assertions(3)
    expect(column).toBeDefined()
    expect(column.originalColumn?.column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
    expect(column.originalColumn.settings.values).toStrictEqual({
      [singleSelectOption1UUID]: {
        label: 'option 1'
      },
      [singleSelectOption2UUID]: {
        label: 'option 2'
      },
      [singleSelectOption3UUID]: {
        label: 'option 3'
      }
    })
  })
  it('set the original column for a looked up column defined on a user', async () => {
    const column = await app.service('column').get(columnTable2LookedUpColumnTable1User.id)

    expect.assertions(2)
    expect(column).toBeDefined()
    expect(column.originalColumn?.column_type_id).toBe(COLUMN_TYPE.USER)
  })
  it('set all original column for all table columns', async () => {
    const columns = await app.service('column').find({
      query: {
        table_id: table2.id
      }
    }) as unknown as Paginated<TableColumn>

    expect.assertions(8)
    expect(columns).toBeDefined()
    expect(columns.data.length).toBe(6)

    const columnsLkdUpColumn = columns.data.filter(c => c.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN)
    expect(columnsLkdUpColumn.length).toBe(4)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1Ref.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.STRING)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1Date.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.DATE)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1SingleSelect.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1SingleSelect.id)?.originalColumn?.settings.values).toStrictEqual({
      [singleSelectOption1UUID]: {
        label: 'option 1'
      },
      [singleSelectOption2UUID]: {
        label: 'option 2'
      },
      [singleSelectOption3UUID]: {
        label: 'option 3'
      }
    })
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1User.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.USER)
  })
  it('set all original column for all table columns when getting a single table with eager columns', async () => {
    const table = await app.service('table').get(table2.id, {
      query: {
        $eager: '[columns]'
      }
    }) as Table

    expect.assertions(8)
    expect(table).toBeDefined()
    expect(table.columns?.length).toBe(6)

    const columnsLkdUpColumn = (table.columns as TableColumn[]).filter(c => c.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN)
    expect(columnsLkdUpColumn.length).toBe(4)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1Ref.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.STRING)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1Date.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.DATE)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1SingleSelect.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1SingleSelect.id)?.originalColumn?.settings.values).toStrictEqual({
      [singleSelectOption1UUID]: {
        label: 'option 1'
      },
      [singleSelectOption2UUID]: {
        label: 'option 2'
      },
      [singleSelectOption3UUID]: {
        label: 'option 3'
      }
    })
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1User.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.USER)
  })

  it('set all original column for all table columns even if not paginated', async () => {
    const columns = await app.service('column').find({
      query: {
        table_id: table2.id,
        $limit: -1
      }
    }) as unknown as TableColumn[]

    expect.assertions(8)
    expect(columns).toBeDefined()
    expect(columns.length).toBe(6)

    const columnsLkdUpColumn = columns.filter(c => c.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN)
    expect(columnsLkdUpColumn.length).toBe(4)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1Ref.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.STRING)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1Date.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.DATE)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1SingleSelect.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1SingleSelect.id)?.originalColumn?.settings.values).toStrictEqual({
      [singleSelectOption1UUID]: {
        label: 'option 1'
      },
      [singleSelectOption2UUID]: {
        label: 'option 2'
      },
      [singleSelectOption3UUID]: {
        label: 'option 3'
      }
    })
    expect(columnsLkdUpColumn.find(c => c.id === columnTable2LookedUpColumnTable1User.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.USER)
  })

  it('set the original column for a looked up column defined on a simple type (date) through another looked up column', async () => {
    const column = await app.service('column').get(columnTable3LookedUpColumnTable2Date.id)

    expect.assertions(2)
    expect(column).toBeDefined()
    expect(column.originalColumn?.column_type_id).toBe(COLUMN_TYPE.DATE)
  })
  it('set the original column for a looked up column defined on a single select through another looked up column', async () => {
    const column = await app.service('column').get(columnTable3LookedUpColumnTable2SingleSelect.id)

    expect.assertions(3)
    expect(column).toBeDefined()
    expect(column.originalColumn?.column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
    expect(column.originalColumn.settings.values).toStrictEqual({
      [singleSelectOption1UUID]: {
        label: 'option 1'
      },
      [singleSelectOption2UUID]: {
        label: 'option 2'
      },
      [singleSelectOption3UUID]: {
        label: 'option 3'
      }
    })
  })

  it('set all original column for all table columns even through others looked up columns', async () => {
    const columns = await app.service('column').find({
      query: {
        table_id: table3.id
      }
    }) as unknown as Paginated<TableColumn>

    expect.assertions(6)
    expect(columns).toBeDefined()
    expect(columns.data.length).toBe(4)

    const columnsLkdUpColumn = columns.data.filter(c => c.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN)
    expect(columnsLkdUpColumn.length).toBe(2)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2Date.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.DATE)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2SingleSelect.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2SingleSelect.id)?.originalColumn?.settings.values).toStrictEqual({
      [singleSelectOption1UUID]: {
        label: 'option 1'
      },
      [singleSelectOption2UUID]: {
        label: 'option 2'
      },
      [singleSelectOption3UUID]: {
        label: 'option 3'
      }
    })
  })
  it('set all original column for all table columns when getting a single table with eager columns even through others looked up columns', async () => {
    const table = await app.service('table').get(table3.id, {
      query: {
        $eager: '[columns]'
      }
    }) as Table

    expect.assertions(6)
    expect(table).toBeDefined()
    expect(table.columns?.length).toBe(4)

    const columnsLkdUpColumn = (table.columns as TableColumn[]).filter(c => c.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN)
    expect(columnsLkdUpColumn.length).toBe(2)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2Date.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.DATE)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2SingleSelect.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2SingleSelect.id)?.originalColumn?.settings.values).toStrictEqual({
      [singleSelectOption1UUID]: {
        label: 'option 1'
      },
      [singleSelectOption2UUID]: {
        label: 'option 2'
      },
      [singleSelectOption3UUID]: {
        label: 'option 3'
      }
    })
  })

  it('set all original column for all table columns even if not paginated even through others looked up columns', async () => {
    const columns = await app.service('column').find({
      query: {
        table_id: table3.id,
        $limit: -1
      }
    }) as unknown as TableColumn[]

    expect.assertions(6)
    expect(columns).toBeDefined()
    expect(columns.length).toBe(4)

    const columnsLkdUpColumn = columns.filter(c => c.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN)
    expect(columnsLkdUpColumn.length).toBe(2)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2Date.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.DATE)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2SingleSelect.id)?.originalColumn?.column_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
    expect(columnsLkdUpColumn.find(c => c.id === columnTable3LookedUpColumnTable2SingleSelect.id)?.originalColumn?.settings.values).toStrictEqual({
      [singleSelectOption1UUID]: {
        label: 'option 1'
      },
      [singleSelectOption2UUID]: {
        label: 'option 2'
      },
      [singleSelectOption3UUID]: {
        label: 'option 3'
      }
    })
  })
  afterAll(async () => {
    await app.service('column').remove(columnTable3LookedUpColumnTable2SingleSelect.id)
    await app.service('column').remove(columnTable3LookedUpColumnTable2Date.id)
    await app.service('column').remove(columnTable3RelationBetweenTable2.id)
    await app.service('column').remove(columnTable3Ref.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1SingleSelect.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1Date.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1Ref.id)
    await app.service('column').remove(columnTable1SingleSelect.id)
    await app.service('column').remove(columnTable1Date.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('table').remove(table3.id)
    await app.service('table').remove(table2.id)
    await app.service('table').remove(table1.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
