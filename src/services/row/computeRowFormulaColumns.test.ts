import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { TableRow } from '../../models/tablerow.model'

describe('computeRowFormulaColumns hooks', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let table3: Table
  let table1StringColumn1: TableColumn
  let table1StringColumn2: TableColumn
  let table1BooleanColumn1: TableColumn
  let table1FormulaColumn1: TableColumn
  let table1FormulaColumn2: TableColumn
  let table1FormulaColumn3: TableColumn
  let table1FormulaColumn4: TableColumn
  let table1RelationBetweenTableT2: TableColumn
  let table1LookedUpColumnT2: TableColumn
  let table2StringColumn1: TableColumn
  let table3RelationBetweenTableT1: TableColumn
  let table3LookedUpColumnT1: TableColumn
  let table3FormulaColumn1: TableColumn
  let table1Row1: TableRow
  let table1Row2: TableRow
  let table1Row3: TableRow
  let table2Row1: TableRow
  let table2Row2: TableRow
  let table2Row3: TableRow
  let table3Row3: TableRow
  let table3Row1: TableRow
  let table3Row2: TableRow

  beforeAll(async () => {
    // Create workspace
    workspace = await app.service('workspace').create({ text: 'workspace1' })
    // Create database
    database = await app.service('database').create({ text: 'database1', workspace_id: workspace.id })
    // Create tables
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
    // Create columns
    // Table 2
    table2StringColumn1 = await app.service('column').create({
      text: 'table2_string_column_1',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    // Table 1
    table1StringColumn1 = await app.service('column').create({
      text: 'table1_string_column_1',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    table1StringColumn2 = await app.service('column').create({
      text: 'table1_string_column_2',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    table1BooleanColumn1 = await app.service('column').create({
      text: 'table1_boolean_column_1',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id,
    })
    table1RelationBetweenTableT2 = await app.service('column').create({
      text: 'table1_relation_between_table_t2',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table1.id,
      settings: {
        tableId: table2.id,
      },
    })
    table1LookedUpColumnT2 = await app.service('column').create({
      text: 'table1_looked_up_column_t2',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table1.id,
      settings: {
        tableId: table2.id,
        localField: table1RelationBetweenTableT2.id,
        foreignField: table2StringColumn1.id,
      },
    })
    // Formula with one related column
    table1FormulaColumn1 = await app.service('column').create({
      text: 'table1_formula_column_1',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: `COLUMN.{${table1StringColumn1.id}}`,
      },
    })
    // Formula with two related columns
    table1FormulaColumn2 = await app.service('column').create({
      text: 'table1_formula_column_2',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: `TEXT.CONCAT(COLUMN.{${table1StringColumn1.id}},"-",COLUMN.{${table1StringColumn2.id}})`,
      },
    })
    // Formula without any related column
    table1FormulaColumn3 = await app.service('column').create({
      text: 'table1_formula_column_3',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: '10',
      },
    })
    // Formula with two related columns whose one is a looked_up_column
    table1FormulaColumn4 = await app.service('column').create({
      text: 'table1_formula_column_4',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: `TEXT.CONCAT(COLUMN.{${table1StringColumn1.id}},"-",COLUMN.{${table1LookedUpColumnT2.id}})`,
      },
    })
    // Table 3
    table3RelationBetweenTableT1 = await app.service('column').create({
      text: 'table3_relation_between_table_t1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table3.id,
      settings: {
        tableId: table1.id,
      },
    })
    table3LookedUpColumnT1 = await app.service('column').create({
      text: 'table3_looked_up_column_t1',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        tableId: table1.id,
        localField: table3RelationBetweenTableT1.id,
        foreignField: table1LookedUpColumnT2.id,
      },
    })
    // Formula with one looked_up_column
    table3FormulaColumn1 = await app.service('column').create({
      text: 'table3_formula_column_1',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table3.id,
      settings: {
        formula: `TEXT.UPPER(COLUMN.{${table3LookedUpColumnT1.id}})`,
      },
    })
  })

  afterAll(async () => {
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('table').remove(table3.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
    await app.service('column').remove(table1StringColumn1.id)
    await app.service('column').remove(table1BooleanColumn1.id)
    await app.service('column').remove(table1StringColumn2.id)
    await app.service('column').remove(table1FormulaColumn1.id)
    await app.service('column').remove(table1FormulaColumn2.id)
    await app.service('column').remove(table1FormulaColumn3.id)
    await app.service('column').remove(table1FormulaColumn4.id)
    await app.service('column').remove(table1LookedUpColumnT2.id)
    await app.service('column').remove(table1RelationBetweenTableT2.id)
    await app.service('column').remove(table2StringColumn1.id)
    await app.service('column').remove(table3FormulaColumn1.id)
    await app.service('column').remove(table3LookedUpColumnT1.id)
    await app.service('column').remove(table3RelationBetweenTableT1.id)
  })

  beforeEach(async () => {
    // Create table 2 rows
    table2Row1 = await app.service('row').create({
      data: {
        [table2StringColumn1.id]: 'table2MyFirstRow1',
      },
      table_id: table2.id,
    })
    table2Row2 = await app.service('row').create({
      data: {
        [table2StringColumn1.id]: 'table2MySecondRow1',
      },
      table_id: table2.id,
    })
    table2Row3 = await app.service('row').create({
      data: {
        [table2StringColumn1.id]: 'table2MyThirdRow1',
      },
      table_id: table2.id,
    })
    // Create table 1 rows
    table1Row1 = await app.service('row').create({
      data: {
        [table1StringColumn1.id]: 'table1MyFirstRow1',
        [table1StringColumn2.id]: 'table1MyFirstRow2',
        [table1BooleanColumn1.id]: false,
        [table1RelationBetweenTableT2.id]: table2Row1.id,
      },
      table_id: table1.id,
    })
    // Create table 3 rows
    table3Row1 = await app.service('row').create({
      data: {
        [table3RelationBetweenTableT1.id]: table1Row1.id,
      },
      table_id: table3.id,
    })
  })

  afterEach(async () => {
    // Clean database
    await app.service('row').remove(table3Row1.id)
    await app.service('row').remove(table1Row1.id)
    await app.service('row').remove(table2Row1.id)
    await app.service('row').remove(table2Row2.id)
    await app.service('row').remove(table2Row3.id)
  })

  describe('On creation', () => {
    it('Init the formulas columns', async () => {
      expect.assertions(4)
      expect(table1Row1.data[table1FormulaColumn1.id]).toBe('table1MyFirstRow1')
      expect(table1Row1.data[table1FormulaColumn2.id]).toBe('table1MyFirstRow1-table1MyFirstRow2')
      expect(table1Row1.data[table1FormulaColumn3.id]).toBe(10)
      expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstRow1-table2MyFirstRow1')
    })
  })

  describe('On single update', () => {
    it('Update the formulas columns when two columns change', async () => {
      expect.assertions(3)
      table1Row1 = await app.service('row').patch(table1Row1.id, {
        data: {
          [table1StringColumn1.id]: 'table1MyFirstUpdatedRow1',
          [table1StringColumn2.id]: 'table1MyFirstUpdatedRow2',
        },
      }, {})
      expect(table1Row1.data[table1FormulaColumn1.id]).toBe('table1MyFirstUpdatedRow1')
      expect(table1Row1.data[table1FormulaColumn2.id]).toBe('table1MyFirstUpdatedRow1-table1MyFirstUpdatedRow2')
      expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstUpdatedRow1-table2MyFirstRow1')
    })

    it('Update the formulas columns when one column change', async () => {
      expect.assertions(3)
      table1Row1 = await app.service('row').patch(table1Row1.id, {
        data: {
          [table1StringColumn1.id]: 'table1MyFirstUpdatedRow1',
        },
      }, {})
      expect(table1Row1.data[table1FormulaColumn1.id]).toBe('table1MyFirstUpdatedRow1')
      expect(table1Row1.data[table1FormulaColumn2.id]).toBe('table1MyFirstUpdatedRow1-table1MyFirstRow2')
      expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstUpdatedRow1-table2MyFirstRow1')
    })

    it('Update the formulas columns when the relation between table column change', async () => {
      expect.assertions(1)
      table1Row1 = await app.service('row').patch(table1Row1.id, {
        data: {
          [table1RelationBetweenTableT2.id]: table2Row2.id,
        },
      }, {})
      expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstRow1-table2MySecondRow1')
    })

    it('Update the formulas columns when the looked_up_column value change in a child row', async () => {
      expect.assertions(1)
      table2Row1 = await app.service('row').patch(table2Row1.id, {
        data: {
          [table2StringColumn1.id]: 'table2MyFirstUpdatedRow1',
        },
      }, {})
      table1Row1 = await app.service('row').get(table1Row1.id)
      expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstRow1-table2MyFirstUpdatedRow1')
    })

    it('Update the formulas columns when the looked_up_column value change in a grandchild row', async () => {
      expect.assertions(1)
      table2Row1 = await app.service('row').patch(table2Row1.id, {
        data: {
          [table2StringColumn1.id]: 'table2MyFirstUpdatedRow1',
        },
      }, {})
      table3Row1 = await app.service('row').get(table3Row1.id)
      expect(table3Row1.data[table3FormulaColumn1.id]).toBe('TABLE2MYFIRSTUPDATEDROW1')
    })
  })

  describe('On multiple update', () => {
    afterEach(async () => {
      await app.service('row').remove(table3Row2.id)
      await app.service('row').remove(table3Row3.id)
      await app.service('row').remove(table1Row2.id)
      await app.service('row').remove(table1Row3.id)
    })

    beforeEach(async () => {
      // Create table 1 rows
      table1Row2 = await app.service('row').create({
        data: {
          [table1StringColumn1.id]: 'table1MySecondRow1',
          [table1StringColumn2.id]: 'table1MySecondRow2',
          [table1BooleanColumn1.id]: true,
          [table1RelationBetweenTableT2.id]: table2Row2.id,
        },
        table_id: table1.id,
      })
      table1Row3 = await app.service('row').create({
        data: {
          [table1StringColumn1.id]: 'table1MyThirdRow1',
          [table1StringColumn2.id]: 'table1MyThirdRow2',
          [table1BooleanColumn1.id]: true,
          [table1RelationBetweenTableT2.id]: table2Row3.id,
        },
        table_id: table1.id,
      })
      // Create table 3 rows
      table3Row2 = await app.service('row').create({
        data: {
          [table3RelationBetweenTableT1.id]: table1Row2.id,
        },
        table_id: table3.id,
      })
      table3Row3 = await app.service('row').create({
        data: {
          [table3RelationBetweenTableT1.id]: table1Row3.id,
        },
        table_id: table3.id,
      })
    })
    it('Throw an exception if it is a multiple patch of columns which are not formula ones', async () => {
      expect.assertions(1)
      await expect(app.service('row').patch(null, {
        data: {
          [table2StringColumn1.id]: 'table2MyUpdatedRow1',
        },
      }, {
        query: {
          table_id: table2.id,
          'table_row.id': {
            $in: [table2Row1.id, table2Row2.id, table3Row3.id],
          },
        },
      })).rejects.toThrowError()
      // table1Row1 = await app.service('row').get(table1Row1.id)
      // expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstRow1-table2MyUpdatedRow1')
      // table1Row2 = await app.service('row').get(table1Row2.id)
      // expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MySecondRow1-table2MyUpdatedRow1')
      // table1Row3 = await app.service('row').get(table1Row3.id)
      // expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyThirdRow1-table2MyUpdatedRow1')
    })
  })
})
