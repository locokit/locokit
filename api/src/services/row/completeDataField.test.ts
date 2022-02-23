import { COLUMN_TYPE } from '@locokit/lck-glossary/src'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('completeDataField hook', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let table2: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let user1: User
  let rowTable1: TableRow
  let columnTable1FirstName: TableColumn
  let columnTable1LastName: TableColumn

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
    table2 = await app.service('table').create({
      text: 'table2',
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
      email: 'user1-data-field@locokit.io',
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
      },
    })
  })

  it('complete data field when patching it', async () => {
    const rowTablePatched = await app.service('row').patch(rowTable1.id, {
      data: {
        [columnTable1FirstName.id]: 'new firstname',
      },
    })
    expect.assertions(4)
    expect(rowTablePatched.data[columnTable1FirstName.id]).toBe('new firstname')
    expect(rowTablePatched.data[columnTable1LastName.id]).toBe('last name')
    expect(rowTablePatched.data[columnTable1User.id]).toStrictEqual({
      reference: user1.id,
      value: user1.name,
    })
    expect(rowTablePatched.data[columnTable1Ref.id]).toBe('this is a ref')
    await app.service('row').remove(rowTable1.id)
  })

  afterAll(async () => {
    await dropWorkspace(app, workspace.id)
    // await app.service('row').remove(rowTable1.id)
    // await app.service('user').remove(user1.id)
    // await app.service('column').remove(columnTable1LastName.id)
    // await app.service('column').remove(columnTable1FirstName.id)
    // await app.service('column').remove(columnTable1User.id)
    // await app.service('column').remove(columnTable1Ref.id)
    // await app.service('table').remove(table1.id)
    // await app.service('table').remove(table2.id)
    // await app.service('database').remove(database.id)
    // // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    // await app.service('aclset').remove(workspace.aclsets?.[0].id as string)
    // await app.service('workspace').remove(workspace.id)
  })
})
