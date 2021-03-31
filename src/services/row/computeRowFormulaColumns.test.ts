import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { TableRow } from '../../models/tablerow.model'
import {
  getSQLRequestFromFormula,
} from '../../utils/formulas'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const formulasParser = require('../../utils/formulas/formulaParser.js')

describe('formulaColumn hooks', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let table1StringColumn1: TableColumn
  let table1StringColumn2: TableColumn
  let table1BooleanColumn1: TableColumn
  let table1FormulaColumn1: TableColumn
  let table1FormulaColumn2: TableColumn
  let table1FormulaColumn3: TableColumn
  let table1FormulaColumn4: TableColumn
  let table1RelationBetweenTable1: TableColumn
  let table1LookedUpColumn1: TableColumn
  let table2StringColumn1: TableColumn
  let table2Row1: TableRow
  let table2Row2: TableRow

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
    // Create columns
    table2StringColumn1 = await app.service('column').create({
      text: 'table2_string_column_1',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
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
    table1RelationBetweenTable1 = await app.service('column').create({
      text: 'table1_relation_between_table_1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table1.id,
      settings: {
        tableId: table2.id,
      },
    })
    table1LookedUpColumn1 = await app.service('column').create({
      text: 'table1_looked_up_column',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table1.id,
      settings: {
        tableId: table2.id,
        localField: table1RelationBetweenTable1.id,
        foreignField: table2StringColumn1.id,
      },
    })
    // Formula with one related column
    table1FormulaColumn1 = await app.service('column').create({
      text: 'formula_column_1',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula_type_id: COLUMN_TYPE.STRING,
        formula: `COLUMN.${table1StringColumn1.id}`,
      },
    })
    // Formula with two related columns
    table1FormulaColumn2 = await app.service('column').create({
      text: 'formula_column_2',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula_type_id: COLUMN_TYPE.STRING,
        formula: `TEXT.CONCAT(COLUMN.${table1StringColumn1.id},"-",COLUMN.${table1StringColumn2.id})`,
      },
    })
    // Formula without any related column
    table1FormulaColumn3 = await app.service('column').create({
      text: 'formula_column_3',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula_type_id: COLUMN_TYPE.STRING,
        formula: '10',
      },
    })
    // Formula with two related columns whose one is a looked_up_column
    table1FormulaColumn4 = await app.service('column').create({
      text: 'formula_column_2',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula_type_id: COLUMN_TYPE.STRING,
        formula: `TEXT.CONCAT(COLUMN.${table1StringColumn1.id},"-",COLUMN.${table1LookedUpColumn1.id})`,
      },
    })
    // Create rows
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
  })

  afterAll(async () => {
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
    await app.service('column').remove(table1StringColumn1.id)
    await app.service('column').remove(table1StringColumn2.id)
    await app.service('column').remove(table1FormulaColumn1.id)
    await app.service('column').remove(table1FormulaColumn2.id)
    await app.service('column').remove(table1FormulaColumn3.id)
    await app.service('column').remove(table1FormulaColumn4.id)
    await app.service('column').remove(table1LookedUpColumn1.id)
    await app.service('column').remove(table1RelationBetweenTable1.id)
    await app.service('column').remove(table2StringColumn1.id)
    await app.service('row').remove(table2Row1.id)
    await app.service('row').remove(table2Row2.id)
  })

  describe('On creation', () => {
    it('Init the formulas columns', async () => {
      const table1Row1: TableRow = await app.service('row').create({
        data: {
          [table1StringColumn1.id]: 'table1MyFirstRow1',
          [table1StringColumn2.id]: 'table1MyFirstRow2',
          [table1BooleanColumn1.id]: false,
          [table1RelationBetweenTable1.id]: table2Row1.id,
        },
        table_id: table1.id,
      })
      expect(table1Row1.data[table1FormulaColumn1.id]).toBe('table1MyFirstRow1')
      expect(table1Row1.data[table1FormulaColumn2.id]).toBe('table1MyFirstRow1-table1MyFirstRow2')
      expect(table1Row1.data[table1FormulaColumn3.id]).toBe(10)
      expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstRow1-table2MyFirstRow1')
      // Clean database
      await app.service('row').remove(table1Row1.id)
    })
  })

  describe('On single update', () => {
    let table1Row1: TableRow

    afterEach(async () => {
      await app.service('row').remove(table1Row1.id)
    })

    beforeEach(async () => {
      table1Row1 = await app.service('row').create({
        data: {
          [table1StringColumn1.id]: 'table1MyFirstRow1',
          [table1StringColumn2.id]: 'table1MyFirstRow2',
          [table1BooleanColumn1.id]: false,
          [table1RelationBetweenTable1.id]: table2Row1.id,
        },
        table_id: table1.id,
      })
    })

    it('Update the formulas columns when two columns change', async () => {
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
      table1Row1 = await app.service('row').patch(table1Row1.id, {
        data: {
          [table1RelationBetweenTable1.id]: table2Row2.id,
        },
      }, {})
      expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstRow1-table2MySecondRow1')
    })
    it('Update the formulas columns when the looked_up_column value change', async () => {
      table2Row1 = await app.service('row').patch(table2Row1.id, {
        data: {
          [table2StringColumn1.id]: 'table2MyFirstUpdatedRow1',
        },
      }, {})
      table1Row1 = await app.service('row').get(table1Row1.id)
      expect(table1Row1.data[table1FormulaColumn4.id]).toBe('table1MyFirstRow1-table2MyFirstUpdatedRow1')
    })
  })
})
