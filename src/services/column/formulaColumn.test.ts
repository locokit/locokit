import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { GeneralError, NotAcceptable } from '@feathersjs/errors'
import { TableRow } from '../../models/tablerow.model'
import { Paginated } from '@feathersjs/feathers'

describe('formulaColumn hooks', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let stringColumn1: TableColumn
  let stringColumn2: TableColumn
  let formulaColumn1: TableColumn
  let formulaColumn2: TableColumn
  let singleSelectColumn1: TableColumn
  let row1Table1: TableRow
  let row2Table1: TableRow

  beforeAll(async () => {
    // Create workspace and database
    workspace = await app.service('workspace').create({ text: 'workspace1' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<database>
    database = workspaceDatabases.data[0]
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
    stringColumn1 = await app.service('column').create({
      text: 'string_column_1',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    stringColumn2 = await app.service('column').create({
      text: 'string_column_2',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    singleSelectColumn1 = await app.service('column').create({
      text: 'singleselect_column_1',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          id1: {
            label: 'option 1',
          },
          id2: {
            label: 'option 2',
          },
          id3: {
            label: 'option 3',
          },
        },
      },
    })
    formulaColumn1 = await app.service('column').create({
      text: 'formula_column_1',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: '""',
      },
    })
    formulaColumn2 = await app.service('column').create({
      text: 'formula_column_2',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table2.id,
      settings: {
        formula: '""',
      },
    })
    // Create rows
    row1Table1 = await app.service('row').create({
      data: {
        [stringColumn1.id]: 'myFirstRow',
        [singleSelectColumn1.id]: 'id1',
      },
      table_id: table1.id,
    })
    row2Table1 = await app.service('row').create({
      data: {
        [stringColumn1.id]: 'mySecondRow',
        [singleSelectColumn1.id]: 'id2',
      },
      table_id: table1.id,
    })
  })

  afterAll(async () => {
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
    await app.service('column').remove(stringColumn1.id)
    await app.service('column').remove(stringColumn2.id)
    await app.service('column').remove(formulaColumn1.id)
    await app.service('column').remove(formulaColumn2.id)
    await app.service('column').remove(singleSelectColumn1.id)
    await app.service('row').remove(row1Table1.id)
    await app.service('row').remove(row2Table1.id)
  })

  describe('On update', () => {
    afterEach(async () => {
      // Reset the formula
      await app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: '""',
        },
      })
    })
    it('throw an exception if no settings are specified', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: null,
      })).rejects.toThrow(NotAcceptable)
    })
    it('throw an exception if the formula is null', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: null,
        },
      })).rejects.toThrow(NotAcceptable)
    })
    it('throw an exception if the formula is an empty string', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: '',
        },
      })).rejects.toThrow(NotAcceptable)
    })
    it('throw an exception if a formula is used as reference', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        reference: true,
        settings: {
          formula: '"string"',
        },
      })).rejects.toThrow(NotAcceptable)
    })
    it('throw an exception if the formula column is specified in its formula', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: `COLUMN.{${formulaColumn1.id}}`,
        },
      })).rejects.toThrow(NotAcceptable)
    })
    it('throw an exception if an unsupported column is specified in the formula', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: `COLUMN.{${formulaColumn2.id}}`,
        },
      })).rejects.toThrow(NotAcceptable)
    })
    it('throw an exception if an unknown column is specified in the formula', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: 'COLUMN.{incorrectid}',
        },
      })).rejects.toThrow(NotAcceptable)
    })
    it('throw an exception if a column in another table is specified in the formula', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: `COLUMN.{${stringColumn2.id}}`,
        },
      })).rejects.toThrow(NotAcceptable)
    })
    it('throw an exception if there is a syntax error in the formula', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: 'SYNTAX_ERROR',
        },
      })).rejects.toThrow(NotAcceptable)
    })

    it('throw an exception if there is an error when updating related rows', async () => {
      expect.assertions(1)
      jest.spyOn(app.service('row'), 'patch').mockRejectedValueOnce(new Error('Can not be computed'))
      await expect(app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: '10',
        },
      })).rejects.toThrow(GeneralError)
    })

    it('don\'t throw an exception if no row needs to be updated', async () => {
      expect.assertions(1)
      await expect(app.service('column').patch(formulaColumn2.id, {
        settings: {
          formula: '"test"',
        },
      })).resolves.not.toThrow()
      // Reset the formula
      await app.service('column').patch(formulaColumn2.id, {
        settings: {
          formula: '""',
        },
      })
    })

    it('don\'t update the rows if the formula is the same as before', async () => {
      expect.assertions(1)
      const spyOnPatchRow = jest.spyOn(app.service('row'), 'patch')
      spyOnPatchRow.mockClear()
      await app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: '""',
        },
      })
      expect(spyOnPatchRow).not.toHaveBeenCalled()
    })

    it('update the rows if the formula, without any specified column, has been changed', async () => {
      expect.assertions(2)
      await app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: '"My new formula"',
        },
      })
      row1Table1 = await app.service('row').get(row1Table1.id)
      row2Table1 = await app.service('row').get(row2Table1.id)
      expect(row1Table1.data[formulaColumn1.id]).toBe('My new formula')
      expect(row2Table1.data[formulaColumn1.id]).toBe('My new formula')
    })

    it('update the rows if the formula, with one specified column, has been changed', async () => {
      expect.assertions(2)
      await app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: `COLUMN.{${stringColumn1.id}}`,
        },
      })
      row1Table1 = await app.service('row').get(row1Table1.id)
      row2Table1 = await app.service('row').get(row2Table1.id)
      expect(row1Table1.data[formulaColumn1.id]).toBe('myFirstRow')
      expect(row2Table1.data[formulaColumn1.id]).toBe('mySecondRow')
    })

    it('update the rows if the formula, with one specified single select column, has been changed', async () => {
      expect.assertions(2)
      await app.service('column').patch(formulaColumn1.id, {
        settings: {
          formula: `COLUMN.{${singleSelectColumn1.id}}`,
        },
      })
      row1Table1 = await app.service('row').get(row1Table1.id)
      row2Table1 = await app.service('row').get(row2Table1.id)
      expect(row1Table1.data[formulaColumn1.id]).toBe('option 1')
      expect(row2Table1.data[formulaColumn1.id]).toBe('option 2')
    })
  })

  describe('On create', () => {
    it('throw an exception if no table_id is specified', async () => {
      expect.assertions(1)
      await expect(app.service('column').create({
        text: 'formula_column_3',
        column_type_id: COLUMN_TYPE.FORMULA,
        settings: {
          formula: `COLUMN.{${stringColumn2.id}}`,
        },
      })).rejects.toThrow(NotAcceptable)
    })
    it('update the rows if a new formula column, with one specified column, has been created.', async () => {
      const formulaColumn3 = await app.service('column').create({
        text: 'formula_column_3',
        column_type_id: COLUMN_TYPE.FORMULA,
        table_id: table1.id,
        settings: {
          formula: `COLUMN.{${stringColumn1.id}}`,
        },
      })
      row1Table1 = await app.service('row').get(row1Table1.id)
      row2Table1 = await app.service('row').get(row2Table1.id)
      expect(row1Table1.data[formulaColumn3.id]).toBe('myFirstRow')
      expect(row2Table1.data[formulaColumn3.id]).toBe('mySecondRow')
      // Clean database
      await app.service('column').remove(formulaColumn3.id)
    })
  })
})
