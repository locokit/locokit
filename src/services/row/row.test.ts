import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { BadRequest } from '@feathersjs/errors'

describe('\'row\' service', () => {
  it('registered the service', () => {
    const service = app.service('row')
    expect(service).toBeTruthy()
  })

  let workspace: workspace
  let database: database
  let table: Table
  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    table = await app.service('table').create({ text: 'pouet', database_id: database.id })
  })

  it('throw if table_id is not present', async () => {
    const service = app.service('row')
    expect.assertions(1)
    await expect(service.create({
      text: 'test',
    })).rejects.toThrow()
  })
  it('throw if table_id is present but did not exist', async () => {
    const service = app.service('row')
    expect.assertions(1)
    await expect(service.create({
      text: 'test',
      table_id: 'you lose',
    })).rejects.toThrow()
  })
  it('succeed if table_id + data is present and exist', async () => {
    const service = app.service('row')
    expect.assertions(1)
    const row: TableRow = await service.create({
      text: 'test',
      table_id: table.id,
      data: {},
    })
    expect(row).toBeTruthy()
  })

  it('throw if table_id is not in params', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({}))
      .rejects.toThrow(BadRequest)
  })

  it('accept to insert an empty row', async () => {
    expect.assertions(2)
    const rowTable1: TableRow = await app.service('row').create({
      data: {},
      table_id: table.id,
    })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('patch only the "text" property when patching "text" (bug of crush "data" property)', async () => {
    const service = app.service('row')
    const tableColumn = await app.service('column').create({
      text: 'myColumn',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING,
    })
    const currentRow: TableRow = await service.create({
      text: 'test',
      data: {
        [tableColumn.id]: 'myValue',
      },
      table_id: table.id,
    })
    const patchedRow: TableRow = await service.patch(currentRow.id, {
      text: 'new test',
    })
    expect(patchedRow.text).toEqual('new test')
    expect(patchedRow.data[tableColumn.id]).toEqual('myValue')
  })

  afterAll(async () => {
    await app.service('table').remove(table.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
