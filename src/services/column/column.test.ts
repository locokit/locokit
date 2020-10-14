import { Paginated } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { Columnrelation } from '../columnrelation/columnrelation.class'

describe('\'column\' service', () => {
  it('registered the service', () => {
    const service = app.service('column')
    expect(service).toBeTruthy()
  })

  it('create a column without error', async () => {
    expect.assertions(1)
    const service = app.service('column')
    const workspace = await app.service('workspace').create({ text: 'pouet' })
    const database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    const table = await app.service('table').create({ text: 'pouet', database_id: database.id })
    const tableColumn = await service.create({
      text: 'myColumn',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING
    })

    expect(tableColumn).toBeTruthy()
  })

  it('paginate results by default to 10', async () => {
    expect.assertions(2)
    const service = app.service('column')
    const columns: any = await service.find()
    expect(columns.total).toBeDefined()
    expect(columns.limit).toBe(10)
  })

  it('discard pagination when table_id is set in query param and $limit is -1', async () => {
    expect.assertions(5)
    const service = app.service('column')
    const workspace = await app.service('workspace').create({ text: 'pouet' })
    const database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    const table = await app.service('table').create({ text: 'pouet', database_id: database.id })
    const column1 = await service.create({
      text: 'myColumn1',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING
    })
    const column2 = await service.create({
      text: 'myColumn2',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING
    })

    const columns: any = await service.find({
      query: {
        table_id: table.id,
        $limit: -1
      }
    })
    expect(columns.total).not.toBeDefined()
    expect(columns.limit).not.toBeDefined()
    expect(columns.length).toBe(2)
    expect(columns[0].id).toBe(column1.id)
    expect(columns[1].id).toBe(column2.id)
  })
})

describe('hooks for column service', () => {
  let workspace: workspace
  let database: database
  let table1: table
  let table2: table

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
  })

  describe('upsertColumnRelation', () => {
    it('create a column relation when a lookedup column reference another column', async () => {
      const columnTable1Ref: TableColumn = await app.service('column').create({
        text: 'column table 1',
        column_type_id: COLUMN_TYPE.STRING,
        table_id: table1.id
      })
      const columnTable2RelationBetweenTable1: TableColumn = await app.service('column').create({
        text: 'LKDP column table 1',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        table_id: table2.id,
        settings: {
          tableId: table1.id
        }
      })
      const columnTable2LookedUpColumnTable1User: TableColumn = await app.service('column').create({
        text: 'Ref',
        column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
        table_id: table2.id,
        settings: {
          tableId: table1.id,
          localField: columnTable2RelationBetweenTable1.id,
          foreignField: columnTable1Ref.id
        }
      })
      const columnrelation = await app.service('columnrelation').find({
        query: {
          table_column_from_id: columnTable1Ref.id,
          table_column_to_id: columnTable2LookedUpColumnTable1User.id
        }
      }) as Paginated<Columnrelation>
      expect(columnrelation.total).toBe(1)

      await app.service('columnrelation')._remove(null, {
        query: {
          table_column_from_id: columnTable1Ref.id,
          table_column_to_id: columnTable2LookedUpColumnTable1User.id
        }
      })
      await app.service('column')._remove(columnTable2LookedUpColumnTable1User.id, {})
      await app.service('column')._remove(columnTable1Ref.id, {})
      await app.service('column')._remove(columnTable2RelationBetweenTable1.id, {})
    })
  })

  afterAll(async () => {
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
