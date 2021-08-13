import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'
import { NotAcceptable } from '@feathersjs/errors'

describe('checkColumnDefinition hook', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let table2: Table
  let table3: Table
  let table1StringColumn: TableColumn
  let table1FormulaColumn: TableColumn
  let table2RelationBetweenTable1Column: TableColumn
  let table2VirtualLookedUpColumnTable1Column: TableColumn
  let table3RelationBetweenTable2Column: TableColumn

  beforeAll(async () => {
    // workspace
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    // database
    database = workspaceDatabases.data[0]
    // Tables
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

    // Columns - Table 1
    table1StringColumn = await app.service('column').create({
      text: 'T1 - String',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    table1FormulaColumn = await app.service('column').create({
      text: 'T1 - Formula',
      column_type_id: COLUMN_TYPE.FORMULA,
      settings: {
        formula: '10',
      },
      table_id: table1.id,
    })

    // Columns - Table 2
    table2RelationBetweenTable1Column = await app.service('column').create({
      text: 'T2 - RBT > T1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    table2VirtualLookedUpColumnTable1Column = await app.service('column').create({
      text: 'T2 - LUC > T1',
      column_type_id: COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        localField: table2RelationBetweenTable1Column.id,
        foreignField: table1StringColumn.id,
      },
    })

    // Columns - Table 3
    table3RelationBetweenTable2Column = await app.service('column').create({
      text: 'T3 - RBT > T2',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
      },
    })
  })

  it('throw an error if a looked-up column targets a virtual looked-up column', async () => {
    await expect(app.service('column').create({
      text: 'T2 - LUC > T2',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        localField: table3RelationBetweenTable2Column.id,
        foreignField: table2VirtualLookedUpColumnTable1Column.id,
      },
    })).rejects.toThrowError(NotAcceptable)
  })

  it('throw an error if a formula is used as row reference', async () => {
    await expect(app.service('column').patch(table1FormulaColumn.id, {
      text: 'T1 - Formula',
      settings: {
        formula: '10',
      },
      reference: true,
    })).rejects.toThrowError(NotAcceptable)
  })

  it('throw an error if a virtual-looked-up column is used as row reference', async () => {
    await expect(app.service('column').patch(table2VirtualLookedUpColumnTable1Column.id, {
      text: 'T2 - LUC > T1',
      settings: {
        localField: table2RelationBetweenTable1Column.id,
        foreignField: table1StringColumn.id,
      },
      reference: true,
    })).rejects.toThrowError(NotAcceptable)
  })

  afterAll(async () => {
    await app.service('column').remove(table3RelationBetweenTable2Column.id)
    await app.service('column').remove(table2VirtualLookedUpColumnTable1Column.id)
    await app.service('column').remove(table2RelationBetweenTable1Column.id)
    await app.service('column').remove(table1StringColumn.id)
    await app.service('column').remove(table1FormulaColumn.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('table').remove(table3.id)
    await app.service('database').remove(database.id)
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
  })
})
