import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { workspace } from '../../models/workspace.model'

describe('computeTextProperty hook', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let user1: User
  let rowTable1: TableRow
  let columnTable1FirstName: TableColumn
  let columnTable1LastName: TableColumn

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    table1 = await app.service('table').create({
      text: 'table1',
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
  describe('Take the first column if no column is specified as reference', () => {
    let table2: Table

    beforeAll(async () => {
      table2 = await app.service('table').create({
        text: 'table2',
        database_id: database.id,
      })
    })

    afterAll(async () => {
      await app.service('table').remove(table2.id)
    })

    it('If it is a string column, use its value', async () => {
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

    it('If it is a relation between table column, use its value', async () => {
      // Create columns
      const columnTable2RelationBetweenTable1 = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
        },
      })
      // Create rows
      const rowTable1 = await app.service('row').create({
        table_id: table1.id,
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

    it('If it is a formula column, do not use its value but specify "No reference"', async () => {
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

  afterAll(async () => {
    await app.service('row').remove(rowTable1.id)
    await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('table').remove(table1.id)
    await app.service('database').remove(database.id)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
  })
})
