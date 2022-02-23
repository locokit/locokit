import { COLUMN_TYPE } from '@locokit/lck-glossary/src'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import Knex from 'knex'
import { Paginated } from '@feathersjs/feathers'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('geometry columns hooks', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let columnTable1Point: TableColumn

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    database = workspaceDatabases.data[0]
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id,
    })
  })

  it('createGIX hook create an index when a geometry columns is created (point)', async () => {
    columnTable1Point = await app.service('column').create({
      text: 'Point',
      column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
      table_id: table1.id,
    })
    const uuidTableShort = table1.id.substr(0, table1.id.indexOf('-'))
    const uuidColumnShort = columnTable1Point.id.substr(0, columnTable1Point.id.indexOf('-'))

    const isAnIndex = await (app.get('knex') as Knex).raw(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'table_row'
      AND indexname = 'record_table_${uuidTableShort}_field_${uuidColumnShort}'
    `)
    expect.assertions(2)
    expect(isAnIndex.rows.length).toBe(1)
    expect(isAnIndex.rows[0].indexname).toBe(`record_table_${uuidTableShort}_field_${uuidColumnShort}`)
  })

  it('dropGIX hook drop an index when a geometry columns is removed (point)', async () => {
    await app.service('column').remove(columnTable1Point.id)
    const uuidTableShort = table1.id.substr(0, table1.id.indexOf('-'))
    const uuidColumnShort = columnTable1Point.id.substr(0, columnTable1Point.id.indexOf('-'))

    const isAnIndex = await (app.get('knex') as Knex).raw(`
      SELECT indexname FROM pg_indexes WHERE tablename = 'table_row' AND indexname = 'record_table_${uuidTableShort}_field_${uuidColumnShort}'
    `)
    expect.assertions(1)
    expect(isAnIndex.rows.length).toBe(0)
  })

  afterAll(async () => {
    await dropWorkspace(app, workspace.id)
    // await app.service('table').remove(table1.id)
    // await app.service('database').remove(database.id)
    // // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    // await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    // await app.service('workspace').remove(workspace.id)
  })
})
