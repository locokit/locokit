import app from '../../app'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { NotAcceptable } from '@feathersjs/errors'

import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { workspace } from '../../models/workspace.model'
import { TableView } from '../../models/tableview.model'
import { TableViewColumn } from '../../models/tableviewcolumn.model'
import { Paginated } from '@feathersjs/feathers'

describe('\'checkIfTableViewIsLocked\' hook', () => {
  const service = app.service('table-view-has-table-column')
  let workspace: workspace
  let database: database
  let table1: Table
  let tableview: TableView
  let columnTable1Boolean: TableColumn
  let columnTable1Number: TableColumn

  beforeEach(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<database>
    database = workspaceDatabases.data[0]
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id,
    })
    columnTable1Boolean = await app.service('column').create({
      text: 'Boolean',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id,
    })
    columnTable1Number = await app.service('column').create({
      text: 'Number',
      column_type_id: COLUMN_TYPE.NUMBER,
      table_id: table1.id,
    })
    tableview = await app.service('view').create({
      table_id: table1.id,
      text: 'My view',
    }) as TableView
  })

  it(' creation of tvhtc if view is not locked', async () => {
    expect.assertions(3)
    const tvhtc: TableViewColumn = await service.create({
      table_view_id: tableview.id,
      table_column_id: columnTable1Boolean.id,
    })
    expect(tvhtc).toBeTruthy()
    expect(tvhtc.table_view_id).toBe(tableview.id)
    expect(tvhtc.table_column_id).toBe(columnTable1Boolean.id)
    await service.remove(`${tableview.id},${columnTable1Boolean.id}`)
  })

  it(' update of tvhtc if view is not locked', async () => {
    expect.assertions(4)
    await service.create({
      table_view_id: tableview.id,
      table_column_id: columnTable1Boolean.id,
    })
    const tvhtc: TableViewColumn = await service.update(
      `${tableview.id},${columnTable1Boolean.id}`, {
        style: { width: '100px' },
        required: false,
      })
    expect(tvhtc).toBeTruthy()
    expect(tvhtc.table_view_id).toBe(tableview.id)
    expect(tvhtc.table_column_id).toBe(columnTable1Boolean.id)
    expect(tvhtc.style).toEqual({ width: '100px' })
    await service.remove(`${tableview.id},${columnTable1Boolean.id}`)
  })
  it(' patch of tvhtc if view is not locked', async () => {
    expect.assertions(2)
    await service.create({
      table_view_id: tableview.id,
      table_column_id: columnTable1Boolean.id,
    })
    const tvhtc: TableViewColumn = await service.patch(
      `${tableview.id},${columnTable1Boolean.id}`, {
        style: { width: '100px' },
      })
    expect(tvhtc).toBeTruthy()
    expect(tvhtc.style).toEqual({ width: '100px' })
    await service.remove(`${tableview.id},${columnTable1Boolean.id}`)
  })
  it(' remove of tvhtc if view is not locked', async () => {
    expect.assertions(1)
    await service.create({
      table_view_id: tableview.id,
      table_column_id: columnTable1Boolean.id,
    })
    const tvhtc: TableViewColumn = await service.remove(`${tableview.id},${columnTable1Boolean.id}`)
    expect(tvhtc).toBeTruthy()
  })

  it('forbid the creation of tvhtc if view is locked', async () => {
    await app.service('view').patch(
      tableview.id, {
        locked: true,
      },
    )
    expect.assertions(1)
    await expect(
      service.create({
        table_view_id: tableview.id,
        table_column_id: columnTable1Boolean.id,
      }),
    ).rejects.toThrow(NotAcceptable)
    await app.service('view').patch(
      tableview.id, {
        locked: false,
      },
    )
  })
  it('forbid the update of tvhtc if view is locked', async () => {
    expect.assertions(1)
    await service.create({
      table_view_id: tableview.id,
      table_column_id: columnTable1Boolean.id,
    })
    await app.service('view').patch(
      tableview.id, {
        locked: true,
      },
    )
    await expect(
      service.update(`${tableview.id},${columnTable1Boolean.id}`, {
        table_view_id: tableview.id,
        table_column_id: columnTable1Boolean.id,
        style: { width: '100px' },
      }),
    ).rejects.toThrow(NotAcceptable)
    await app.service('view').patch(
      tableview.id, {
        locked: false,
      },
    )
    await service.remove(`${tableview.id},${columnTable1Boolean.id}`)
  })
  it('forbid the patch of tvhtc if view is locked', async () => {
    expect.assertions(1)
    await service.create({
      table_view_id: tableview.id,
      table_column_id: columnTable1Boolean.id,
    })
    await app.service('view').patch(
      tableview.id, {
        locked: true,
      },
    )
    await expect(
      service.patch(`${tableview.id},${columnTable1Boolean.id}`, {
        style: { width: '100px' },
      }),
    ).rejects.toThrow(NotAcceptable)
    await app.service('view').patch(
      tableview.id, {
        locked: false,
      },
    )
    await service.remove(`${tableview.id},${columnTable1Boolean.id}`)
  })
  it('forbid the delete of tvhtc if view is locked', async () => {
    expect.assertions(1)
    await service.create({
      table_view_id: tableview.id,
      table_column_id: columnTable1Boolean.id,
    })
    await app.service('view').patch(
      tableview.id, {
        locked: true,
      },
    )
    await expect(
      service.remove(`${tableview.id},${columnTable1Boolean.id}`),
    ).rejects.toThrow(NotAcceptable)
    await app.service('view').patch(
      tableview.id, {
        locked: false,
      },
    )
    await service.remove(`${tableview.id},${columnTable1Boolean.id}`)
  })

  afterEach(async () => {
    await app.service('column').remove(columnTable1Boolean.id)
    await app.service('column').remove(columnTable1Number.id)
    await app.service('view').remove(tableview.id)
    await app.service('table').remove(table1.id)
    await app.service('database').remove(database.id)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspace.id)
  })
})
