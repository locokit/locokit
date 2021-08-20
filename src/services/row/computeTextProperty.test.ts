import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'

describe('computeTextProperty hook', () => {
  let workspace: Workspace
  let database: Database

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    database = workspaceDatabases.data[0]
  })

  describe('With no column', () => {
    it('If it is a formula column', async () => {
      const tableAlone = await app.service('table').create({
        text: 'tableAlone',
        database_id: database.id,
      })
      // Create row
      const rowTableAlone: TableRow = await app.service('row').create({
        table_id: tableAlone.id,
      })
      // Tests
      expect(rowTableAlone.text).toBe(null)
      // Clean database
      await app.service('row').remove(rowTableAlone.id)
      await app.service('table').remove(tableAlone.id)
    })
  })

  describe('With no reference , take the first column', () => {
    let tableRB: Table
    let table2: Table
    let columnTable1FirstName: TableColumn
    let columnTable1LastName: TableColumn

    beforeAll(async () => {
      tableRB = await app.service('table').create({
        text: 'tableRB',
        database_id: database.id,
      })
      columnTable1FirstName = await app.service('column').create({
        text: 'FirstName',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: tableRB.id,
        reference: true,
        reference_position: 1,
      })
      columnTable1LastName = await app.service('column').create({
        text: 'LastName',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: tableRB.id,
        reference: true,
        reference_position: 2,
      })
      table2 = await app.service('table').create({
        text: 'table2',
        database_id: database.id,
      })
    })

    afterAll(async () => {
      await app.service('column').remove(columnTable1FirstName.id)
      await app.service('column').remove(columnTable1LastName.id)
      await app.service('table').remove(tableRB.id)
      await app.service('table').remove(table2.id)
    })

    it('If it is a string column', async () => {
      // Create column
      const columnTable2Ref = await app.service('column').create({
        text: 'String',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table2.id,
      })
      // Create row
      const rowTable2 = await app.service('row').create({
        table_id: table2.id,
        data: {
          [columnTable2Ref.id]: 'firstString',
        },
      })
      // Tests
      expect.assertions(2)
      expect(rowTable2.text).toBe('firstString')
      expect(rowTable2.data[columnTable2Ref.id]).toBe('firstString')
      // Clean database
      await app.service('row').remove(rowTable2.id)
      await app.service('column').remove(columnTable2Ref.id)
    })
    it('If it is a string column with empty value', async () => {
      // Create column
      const columnTable2Ref = await app.service('column').create({
        text: 'String',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table2.id,
      })
      // Create row
      const rowTable2 = await app.service('row').create({
        table_id: table2.id,
        data: {
          [columnTable2Ref.id]: null,
        },
      })
      // Tests
      expect.assertions(2)
      expect(rowTable2.text).toBe('No reference')
      expect(rowTable2.data[columnTable2Ref.id]).toBe(null)
      // Clean database
      await app.service('row').remove(rowTable2.id)
      await app.service('column').remove(columnTable2Ref.id)
    })
    it('If it is a string column and with duplicated row', async () => {
      // Create column
      const columnTable2Ref = await app.service('column').create({
        text: 'String',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table2.id,
      })
      // Create row
      const row1Table1: TableRow = await app.service('row').create({
        data: {
          [columnTable2Ref.id]: 'firstString',
        },
        table_id: table2.id,
      })
      const row2Table1: TableRow = await app.service('row').create({
        text: row1Table1.text,
        data: row1Table1.data,
        table_id: table2.id,
      })
      // Tests
      expect.assertions(2)
      // Copy reference when duplicated
      expect(row2Table1.text).toBe('firstString')
      expect(row2Table1.data[columnTable2Ref.id]).toBe('firstString')
      // Clean database
      await app.service('row').remove(row1Table1.id)
      await app.service('row').remove(row2Table1.id)
      await app.service('column').remove(columnTable2Ref.id)
    })
    it('If it is a relation between table column', async () => {
      // Create columns
      const columnTable2RelationBetweenTable1 = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table2.id,
        settings: {
          tableId: tableRB.id,
        },
      })
      // Create rows
      const rowTable1 = await app.service('row').create({
        table_id: tableRB.id,
        data: {
          [columnTable1FirstName.id]: 'first name',
          [columnTable1LastName.id]: 'last name',
        },
      })
      const rowTable2 = await app.service('row').create({
        table_id: table2.id,
        data: {
          [columnTable2RelationBetweenTable1.id]: rowTable1.id,
        },
      })
      // Tests
      expect.assertions(2)
      expect(rowTable2.text).toBe('first name last name')
      expect(rowTable2.data[columnTable2RelationBetweenTable1.id].value).toBe('first name last name')
      // Clean database
      await app.service('row').remove(rowTable2.id)
      await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    })
    it('If it is a relation between table column with empty value', async () => {
      // Create columns
      const columnTable2RelationBetweenTable1 = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table2.id,
        settings: {
          tableId: tableRB.id,
        },
      })
      // Create rows
      const rowTable2 = await app.service('row').create({
        table_id: table2.id,
        data: {
          [columnTable2RelationBetweenTable1.id]: null,
        },
      })
      // Tests
      expect.assertions(2)
      expect(rowTable2.text).toBe('No reference')
      expect(rowTable2.data[columnTable2RelationBetweenTable1.id]).toBe(null)
      // Clean database
      await app.service('row').remove(rowTable2.id)
      await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    })
    it('If it is a formula column', async () => {
      // Create column
      const columnTable2FormulaColumn: TableColumn = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.FORMULA,
        table_id: table2.id,
        settings: {
          formula: '"MyFormulaValue"',
        },
      })
      // Create row
      const rowTable2: TableRow = await app.service('row').create({
        table_id: table2.id,
      })
      // Tests
      expect.assertions(2)
      expect(rowTable2.text).toBe('No reference')
      expect(rowTable2.data[columnTable2FormulaColumn.id]).toBe('MyFormulaValue')
      // Clean database
      await app.service('row').remove(rowTable2.id)
      await app.service('column').remove(columnTable2FormulaColumn.id)
    })
  })

  describe('With reference', () => {
    let table1: Table
    let table3: Table
    let columnTable1Ref: TableColumn
    let columnTable1User: TableColumn
    let user1: User
    let rowTable1: TableRow
    let columnTable1FirstName: TableColumn
    let columnTable1LastName: TableColumn

    beforeAll(async () => {
      table1 = await app.service('table').create({
        text: 'table1',
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
      columnTable1FirstName = await app.service('column').create({
        text: 'FirstName',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table1.id,
        reference: true,
        reference_position: 1,
      })
      columnTable1LastName = await app.service('column').create({
        text: 'LastName',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table1.id,
        reference: true,
        reference_position: 2,
      })
      user1 = await app.service('user').create({
        name: 'User 1',
        email: 'user1-text-property@locokit.io',
        password: 'locokit',
      })
    })

    afterAll(async () => {
      await app.service('row').remove(rowTable1.id)
      await app.service('user').remove(user1.id)
      await app.service('column').remove(columnTable1User.id)
      await app.service('column').remove(columnTable1Ref.id)
      await app.service('table').remove(table1.id)
      await app.service('table').remove(table3.id)
    })

    it('compute text property automatically', async () => {
      const service = app.service('row')
      const rowTable1 = await service.create({
        table_id: table1.id,
        data: {
          [columnTable1FirstName.id]: 'first name',
          [columnTable1LastName.id]: 'last name',
        },
      })
      expect.assertions(3)
      expect(rowTable1.text).toBe('first name last name')
      expect(rowTable1.data[columnTable1FirstName.id]).toBe('first name')
      expect(rowTable1.data[columnTable1LastName.id]).toBe('last name')
      await app.service('row').remove(rowTable1.id)
    })
    it('compute text property automatically from duplicated row', async () => {
      // Create row
      const row1Table1: TableRow = await app.service('row').create({
        table_id: table1.id,
        data: {
          [columnTable1FirstName.id]: 'first name',
          [columnTable1LastName.id]: 'last name',
        },
      })
      const row2Table1: TableRow = await app.service('row').create({
        text: row1Table1.text,
        data: row1Table1.data,
        table_id: table1.id,
      })
      // Tests
      expect.assertions(3)
      // Copy reference when duplicated
      expect(row2Table1.text).toBe('first name last name')
      expect(row2Table1.data[columnTable1FirstName.id]).toBe('first name')
      expect(row2Table1.data[columnTable1LastName.id]).toBe('last name')
      // Clean database
      await app.service('row').remove(row1Table1.id)
      await app.service('row').remove(row2Table1.id)
    })
    it('compute text property automatically case with empty value for each column', async () => {
      const service = app.service('row')
      const rowTable1 = await service.create({
        table_id: table1.id,
        data: {
          [columnTable1FirstName.id]: null,
          [columnTable1LastName.id]: null,
        },
      })
      expect.assertions(3)
      expect(rowTable1.text).toBe('No reference')
      expect(rowTable1.data[columnTable1FirstName.id]).toBe(null)
      expect(rowTable1.data[columnTable1LastName.id]).toBe(null)
      await app.service('row').remove(rowTable1.id)
    })
    it('compute text property automatically case with empty value for at least one', async () => {
      const service = app.service('row')
      const rowTable1 = await service.create({
        table_id: table1.id,
        data: {
          [columnTable1FirstName.id]: 'first name',
          [columnTable1LastName.id]: null,
        },
      })
      expect.assertions(3)
      expect(rowTable1.text).toBe('first name')
      expect(rowTable1.data[columnTable1FirstName.id]).toBe('first name')
      expect(rowTable1.data[columnTable1LastName.id]).toBe(null)
      await app.service('row').remove(rowTable1.id)
    })
    it('do not overwrite text property if transmitted', async () => {
      const service = app.service('row')
      const rowTable1 = await service.create({
        table_id: table1.id,
        text: 'table 1 ref',
        data: {
          [columnTable1FirstName.id]: 'first name',
          [columnTable1LastName.id]: 'last name',
        },
      })
      expect.assertions(3)
      expect(rowTable1.text).toBe('table 1 ref')
      expect(rowTable1.data[columnTable1FirstName.id]).toBe('first name')
      expect(rowTable1.data[columnTable1LastName.id]).toBe('last name')
      await app.service('row').remove(rowTable1.id)
    })
    it('If it is a formula column', async () => {
      // Create column
      const columnTable3FormulaColumn: TableColumn = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.FORMULA,
        reference: true,
        reference_position: 0,
        table_id: table3.id,
        settings: {
          formula: '"MyFormulaValue"',
        },
      })
      // Create row
      const rowTable3: TableRow = await app.service('row').create({
        table_id: table3.id,
      })
      // Tests
      expect.assertions(2)
      // Updated by hook computeRowFormulaColumns when we create the row
      expect(rowTable3.text).toBe('MyFormulaValue')
      expect(rowTable3.data[columnTable3FormulaColumn.id]).toBe('MyFormulaValue')
      // Clean database
      await app.service('row').remove(rowTable3.id)
      await app.service('column').remove(columnTable3FormulaColumn.id)
    })
    it('If it is a formula column from duplicated row', async () => {
      // Create column
      const columnTable3FormulaColumn: TableColumn = await app.service('column').create({
        text: 'Refe',
        column_type_id: COLUMN_TYPE.FORMULA,
        reference: true,
        reference_position: 0,
        table_id: table3.id,
        settings: {
          formula: '"MyFormulaValue"',
        },
      })
      // Create row
      const row1Table3: TableRow = await app.service('row').create({
        table_id: table3.id,
      })
      const row2Table3: TableRow = await app.service('row').create({
        text: row1Table3.text,
        data: {
          [columnTable3FormulaColumn.id]: row1Table3.data[columnTable3FormulaColumn.id],
        },
        table_id: table3.id,
      })
      // Tests
      expect.assertions(2)
      // Copy reference when duplicated
      expect(row2Table3.text).toBe('MyFormulaValue')
      expect(row2Table3.data[columnTable3FormulaColumn.id]).toBe('MyFormulaValue')
      // Clean database
      await app.service('row').remove(row1Table3.id)
      await app.service('row').remove(row2Table3.id)
      await app.service('column').remove(columnTable3FormulaColumn.id)
    })
    it('Use the value of a relation between table if in the references', async () => {
      const columnTable3Ref = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table3.id,
        reference: true,
        reference_position: 1,
      })
      const columnTable3RBT = await app.service('column').create({
        text: 'RBT',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table3.id,
        reference: true,
        reference_position: 2,
        settings: {
          tableId: table1.id,
        },
      })
      const columnTable3LUC = await app.service('column').create({
        text: 'LUC',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table3.id,
        reference: true,
        reference_position: 3,
        settings: {
          tableId: table1.id,
          localField: columnTable3RBT.id,
          foreignField: columnTable1FirstName.id,
        },
      })
      const rowTable1 = await app.service('row').create({
        table_id: table1.id,
        data: {
          [columnTable1FirstName.id]: 'first name',
          [columnTable1LastName.id]: 'last name',
        },
      })
      const rowTable3 = await app.service('row').create({
        table_id: table3.id,
        data: {
          [columnTable3Ref.id]: 'hello world',
          [columnTable3RBT.id]: rowTable1.id,
        },
      })
      // Tests
      expect.assertions(3)
      expect(rowTable3.text).toBe('hello world first name last name first name')
      expect(rowTable3.data[columnTable3RBT.id].value).toBe('first name last name')
      expect(rowTable3.data[columnTable3LUC.id].value).toBe('first name')
      // Clean database
      await app.service('row').remove(rowTable3.id)
      await app.service('row').remove(rowTable1.id)
      await app.service('column').remove(columnTable3LUC.id)
      await app.service('column').remove(columnTable3RBT.id)
      await app.service('column').remove(columnTable3Ref.id)
    })
    it('Case with empty value for: Use the value of a relation between table if in the references', async () => {
      const columnTable3Ref = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table3.id,
        reference: true,
        reference_position: 1,
      })
      const columnTable3RBT = await app.service('column').create({
        text: 'RBT',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table3.id,
        reference: true,
        reference_position: 2,
        settings: {
          tableId: table1.id,
        },
      })
      const rowTable3 = await app.service('row').create({
        table_id: table3.id,
        data: {
          [columnTable3Ref.id]: 'hello world',
          [columnTable3RBT.id]: null,
        },
      })
      // Tests
      expect.assertions(2)
      expect(rowTable3.text).toBe('hello world')
      expect(rowTable3.data[columnTable3RBT.id]).toBe(null)
      // Clean database
      await app.service('row').remove(rowTable3.id)
      await app.service('column').remove(columnTable3RBT.id)
      await app.service('column').remove(columnTable3Ref.id)
    })
    it('If it is a formula column', async () => {
      // Create column
      const columnTable3Date: TableColumn = await app.service('column').create({
        text: 'Ref Date',
        column_type_id: COLUMN_TYPE.DATE,
        reference: true,
        reference_position: 1,
        table_id: table3.id,
      })
      const columnTable3DateTime: TableColumn = await app.service('column').create({
        text: 'Ref Date',
        column_type_id: COLUMN_TYPE.DATETIME,
        reference: true,
        reference_position: 2,
        table_id: table3.id,
      })
      // Create row
      const rowTable3: TableRow = await app.service('row').create({
        table_id: table3.id,
        data: {
          [columnTable3Date.id]: '2020-10-29',
          [columnTable3DateTime.id]: '2020-10-29T12:09:12',
        },
      })
      // Tests
      expect.assertions(3)
      // Updated by hook computeRowFormulaColumns when we create the row
      expect(rowTable3.text).toBe('10/29/2020, 12:00:00 AM 10/29/2020')
      expect(rowTable3.data[columnTable3Date.id]).toBe('2020-10-29')
      expect(rowTable3.data[columnTable3DateTime.id]).toBe('2020-10-29T12:09:12')
      // Clean database
      await app.service('row').remove(rowTable3.id)
      await app.service('column').remove(columnTable3Date.id)
      await app.service('column').remove(columnTable3DateTime.id)
    })
  })

  afterAll(async () => {
    await app.service('database').remove(database.id)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
  })
})
