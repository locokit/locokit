import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'
import { TableView } from '../../models/tableview.model'
import { NotAcceptable } from '@feathersjs/errors'

describe('filterRowsByTableViewId hook', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1FirstName: TableColumn
  let columnTable1LastName: TableColumn
  let columnTable1Geom: TableColumn
  let user1: User
  let rowTable1: TableRow
  let rowTable2: TableRow
  let rowTable3: TableRow

  beforeAll(async () => {
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
    columnTable1Geom = await app.service('column').create({
      text: 'geom point',
      column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
      table_id: table1.id,
      reference: true,
      reference_position: 2,
    })
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1-table-view@locokit.io',
      password: 'locokit',
    })
    rowTable1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {
        [columnTable1Ref.id]: 'this is a ref',
        [columnTable1FirstName.id]: 'first name',
        [columnTable1LastName.id]: 'last name',
        [columnTable1User.id]: user1.id,
        [columnTable1Geom.id]: 'SRID=4326;POINT (29.00390625 54.546579538405)',
      },
    })
    rowTable2 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {
        [columnTable1Ref.id]: 'no way table 2',
        [columnTable1FirstName.id]: 'first name',
        [columnTable1LastName.id]: 'last name',
        [columnTable1User.id]: user1.id,
        [columnTable1Geom.id]: 'SRID=4326;POINT (29.00390625 54.546579538405)',
      },
    })
    rowTable3 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {
        [columnTable1Ref.id]: 'lucky table 3',
        [columnTable1FirstName.id]: 'first name',
        [columnTable1LastName.id]: 'last name',
        [columnTable1User.id]: null,
        [columnTable1Geom.id]: 'SRID=4326;POINT (29.00390625 54.546579538405)',
      },
    })
  })

  it('restrict view rows to the filter $eq', async () => {
    const tableView = await app.service('view').create({
      text: 'My view',
      table_id: table1.id,
    }) as TableView
    await app.service('table-view-has-table-column').create({
      table_view_id: tableView.id,
      table_column_id: columnTable1Ref.id,
      filter: {
        $eq: 'lucky table 3',
      },
    })
    const rows = await app.service('row').find({ query: { table_view_id: tableView.id } }) as Paginated<TableRow>
    expect.assertions(2)
    expect(rows.total).toBe(1)
    expect(rows.data[0].id).toBe(rowTable3.id)
    await app.service('view').remove(tableView.id)
  })

  it('restrict view rows to the filter $eq for a user column', async () => {
    const tableView = await app.service('view').create({
      text: 'My view',
      table_id: table1.id,
    }) as TableView
    await app.service('table-view-has-table-column').create({
      table_view_id: tableView.id,
      table_column_id: columnTable1User.id,
      filter: {
        $eq: user1.id,
      },
    })
    const rows = await app.service('row').find({ query: { table_view_id: tableView.id } }) as Paginated<TableRow>
    expect.assertions(1)
    expect(rows.total).toBe(2)
    await app.service('view').remove(tableView.id)
  })

  it('restrict view rows to the filter $in', async () => {
    const tableView = await app.service('view').create({
      text: 'My view',
      table_id: table1.id,
    }) as TableView
    await app.service('table-view-has-table-column').create({
      table_view_id: tableView.id,
      table_column_id: columnTable1Ref.id,
      filter: {
        $in: ['lucky table 3', 'no way table 2'],
      },
    })
    const rows = await app.service('row').find({ query: { table_view_id: tableView.id } }) as Paginated<TableRow>
    expect.assertions(3)
    expect(rows.total).toBe(2)
    if (rows.data[0].id === rowTable3.id) {
      expect(rows.data[0].id).toBe(rowTable3.id)
      expect(rows.data[1].id).toBe(rowTable2.id)
    } else {
      expect(rows.data[0].id).toBe(rowTable2.id)
      expect(rows.data[1].id).toBe(rowTable3.id)
    }
    await app.service('view').remove(tableView.id)
  })

  it('throw an error if $eq is used with {groupId} and $lckGroupId is not provided', async () => {
    const tableView = await app.service('view').create({
      text: 'My view',
      table_id: table1.id,
    }) as TableView
    await app.service('table-view-has-table-column').create({
      table_view_id: tableView.id,
      table_column_id: columnTable1Ref.id,
      filter: {
        $eq: '{groupId}',
      },
    })
    expect.assertions(1)
    await expect(app.service('row').find({ query: { table_view_id: tableView.id } })).rejects.toThrow(NotAcceptable)
    await app.service('view').remove(tableView.id)
  })

  afterAll(async () => {
    await app.service('row').remove(rowTable3.id)
    await app.service('row').remove(rowTable2.id)
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
