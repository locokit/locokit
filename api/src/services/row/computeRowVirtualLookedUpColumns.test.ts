import { COLUMN_TYPE, USER_PROFILE } from '@locokit/lck-glossary'

import { AuthenticationResult } from '@feathersjs/authentication/lib'
import { LocalStrategy } from '@feathersjs/authentication-local/lib/strategy'
import { Paginated } from '@feathersjs/feathers'

import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { Workspace } from '../../models/workspace.model'
import { User } from '../../models/user.model'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('computeRowVirtualLookedUpColumns hook', () => {
  let workspace: Workspace
  let database: Database
  let user: User
  let authentication: AuthenticationResult
  let table1: Table
  let table2: Table
  let table3: Table
  let table1ColumnText: TableColumn
  let table2ColumnRelationBetweenTable1: TableColumn
  let table2ColumnVirtualLookedUpColumnTable1Text: TableColumn
  let table2ColumnVirtualLookedUpColumnTable1TextBis: TableColumn
  let table3ColumnVirtualLookedUpColumnTable2VLUC: TableColumn
  let table3ColumnRelationBetweenTable2: TableColumn
  let table1Row1: TableRow
  let table1Row2: TableRow
  let table2Row1: TableRow
  let table2Row2: TableRow
  let table3Row2: TableRow
  let table3Row1: TableRow

  const firstText = 'First text that we want to reference in the other tables without copying it.'
  const secondText = 'Second text that we want to reference in the other tables without copying it.'

  let outsideCallParams: object = {}

  beforeAll(async () => {
    // Create a fake user
    const userEmail = 'hello-virtual@locokit.io1'
    const userPassword = 'hello-virtual@locokit.io'

    const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
    const passwordHashed = await localStrategy.hashPassword(userPassword, {})
    user = await app.service('user')._create({
      name: 'John',
      email: userEmail,
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.SUPERADMIN,
    }, {})

    // // Simulate the authentication
    authentication = await app.service('authentication').create({
      strategy: 'local',
      email: userEmail,
      password: userPassword,
    }, {})

    // Simulate an outside call
    outsideCallParams = {
      provider: 'external',
      authenticated: true,
      user,
      accessToken: authentication.accessToken,
    }

    // Create workspace
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
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
    table3 = await app.service('table').create({
      text: 'table3',
      database_id: database.id,
    })
    // Create columns
    // Table 1
    table1ColumnText = await app.service('column').create({
      text: 'Text',
      column_type_id: COLUMN_TYPE.TEXT,
      table_id: table1.id,
    })
    // Table 2
    table2ColumnRelationBetweenTable1 = await app.service('column').create({
      text: 'RBT 2 -> 1',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    table2ColumnVirtualLookedUpColumnTable1Text = await app.service('column').create({
      text: 'VLUC 2 -> 1 (Text)',
      column_type_id: COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        localField: table2ColumnRelationBetweenTable1.id,
        foreignField: table1ColumnText.id,
      },
    })
    table2ColumnVirtualLookedUpColumnTable1TextBis = await app.service('column').create({
      text: 'VLUC 2 -> 1 (Text bis)',
      column_type_id: COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        localField: table2ColumnRelationBetweenTable1.id,
        foreignField: table1ColumnText.id,
      },
    })
    // Table 3
    table3ColumnRelationBetweenTable2 = await app.service('column').create({
      text: 'RBT 3 -> 2',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table3.id,
      settings: {
        tableId: table2.id,
      },
    })
    table3ColumnVirtualLookedUpColumnTable2VLUC = await app.service('column').create({
      text: 'VLUC 3 -> 2 (VLUC)',
      column_type_id: COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
      table_id: table3.id,
      settings: {
        localField: table3ColumnRelationBetweenTable2.id,
        foreignField: table2ColumnVirtualLookedUpColumnTable1Text.id,
      },
    })
  })

  beforeEach(async () => {
    // Create rows
    // Table 1
    table1Row1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 row 1',
      data: {
        [table1ColumnText.id]: firstText,
      },
    }, outsideCallParams)
    table1Row2 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 row 2',
      data: {
        [table1ColumnText.id]: secondText,
      },
    }, outsideCallParams)

    // Table 2
    table2Row1 = await app.service('row').create({
      table_id: table2.id,
      text: 'table 2 row 1',
      data: {
        [table2ColumnRelationBetweenTable1.id]: table1Row1.id,
      },
    }, outsideCallParams)
    table2Row2 = await app.service('row').create({
      table_id: table2.id,
      text: 'table 2 row 2',
      data: {
        [table2ColumnRelationBetweenTable1.id]: table1Row2.id,
      },
    }, outsideCallParams)

    // Table 3
    table3Row1 = await app.service('row').create({
      table_id: table3.id,
      text: 'table 3 row 1',
      data: {
        [table3ColumnRelationBetweenTable2.id]: table2Row1.id,
      },
    }, outsideCallParams)
    table3Row2 = await app.service('row').create({
      table_id: table3.id,
      text: 'table 3 row 2',
      data: {
        [table3ColumnRelationBetweenTable2.id]: table2Row2.id,
      },
    }, outsideCallParams)
  })

  it('compute the virtual looked of column at initialization', async () => {
    expect.assertions(6)

    // Children rows
    expect(table2Row1.data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBe(firstText)
    expect(table2Row1.data[table2ColumnVirtualLookedUpColumnTable1TextBis.id]).toBe(firstText)
    expect(table2Row2.data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBe(secondText)
    expect(table2Row2.data[table2ColumnVirtualLookedUpColumnTable1TextBis.id]).toBe(secondText)

    // Grandchildren rows
    expect(table3Row1.data[table3ColumnVirtualLookedUpColumnTable2VLUC.id]).toBe(firstText)
    expect(table3Row2.data[table3ColumnVirtualLookedUpColumnTable2VLUC.id]).toBe(secondText)
  })

  it('compute the virtual looked of column when updating the original row', async () => {
    expect.assertions(2)

    // Update the original row
    await app.service('row').patch(table1Row1.id, {
      data: {
        [table1ColumnText.id]: secondText,
      },
    })

    // Child row
    const newRow1Table2 = await app.service('row').get(table2Row1.id, outsideCallParams)
    expect(newRow1Table2.data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBe(secondText)

    // Grandchild row
    const newRow1Table3 = await app.service('row').get(table3Row1.id, outsideCallParams)
    expect(newRow1Table3.data[table3ColumnVirtualLookedUpColumnTable2VLUC.id]).toBe(secondText)
  })

  it('compute the virtual looked of column when updating the children rows (new RBT value)', async () => {
    expect.assertions(2)

    // Update the child row
    const newRow1Table2 = await app.service('row').patch(table2Row1.id, {
      data: {
        [table2ColumnRelationBetweenTable1.id]: table1Row2.id,
      },
    }, outsideCallParams)
    expect(newRow1Table2.data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBe(secondText)
    // Update the grandchild row

    const newRow1Table3 = await app.service('row').patch(table3Row1.id, {
      data: {
        [table3ColumnRelationBetweenTable2.id]: table2Row2.id,
      },
    }, outsideCallParams)
    expect(newRow1Table3.data[table3ColumnVirtualLookedUpColumnTable2VLUC.id]).toBe(secondText)
  })

  it('compute the virtual looked of column when updating the children rows (reset RBT value)', async () => {
    expect.assertions(2)
    // Update the child row
    const newRow1Table2B = await app.service('row').patch(table2Row1.id, {
      data: {
        [table2ColumnRelationBetweenTable1.id]: null,
      },
    }, outsideCallParams)
    expect(newRow1Table2B.data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBeUndefined()

    // Update the grandchild row
    const newRow1Table3 = await app.service('row').patch(table3Row1.id, {
      data: {
        [table3ColumnRelationBetweenTable2.id]: null,
      },
    }, outsideCallParams)
    expect(newRow1Table3.data[table3ColumnVirtualLookedUpColumnTable2VLUC.id]).toBeUndefined()
  })

  it('compute the virtual looked of columns when getting several rows at the same time (with pagination)', async () => {
    expect.assertions(3)

    // Get the children rows
    const newRowsTable2 = await app.service('row').find({
      query: {
        table_id: table2.id,
        $sort: {
          text: 1,
        },
      },
      $paginate: true,
      _meta: {
        computeVirtualLookedUpColumn: true,
      },
    }) as Paginated<TableRow>

    // Children rows
    expect(newRowsTable2.data).toHaveLength(2)
    expect(newRowsTable2.data[0].data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBe(firstText)
    expect(newRowsTable2.data[1].data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBe(secondText)
  })

  it('compute the virtual looked of columns when getting several rows at the same time (without pagination)', async () => {
    expect.assertions(3)

    // Get the children rows
    const newRowsTable2 = await app.service('row').find({
      query: {
        table_id: table2.id,
        $sort: {
          text: 1,
        },
        $limit: -1,
      },
      _meta: {
        computeVirtualLookedUpColumn: true,
      },
    }) as TableRow[]

    // Children rows
    expect(newRowsTable2).toHaveLength(2)
    expect(newRowsTable2[0].data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBe(firstText)
    expect(newRowsTable2[1].data[table2ColumnVirtualLookedUpColumnTable1Text.id]).toBe(secondText)
  })

  afterEach(async () => {
    // Clean rows
    await app.service('row').remove(table3Row1.id)
    await app.service('row').remove(table3Row2.id)
    await app.service('row').remove(table2Row1.id)
    await app.service('row').remove(table2Row2.id)
    await app.service('row').remove(table1Row1.id)
    await app.service('row').remove(table1Row2.id)
  })

  afterAll(async () => {
    // Clean table 3
    await app.service('column').remove(table3ColumnVirtualLookedUpColumnTable2VLUC.id)
    await app.service('column').remove(table3ColumnRelationBetweenTable2.id)
    await app.service('table').remove(table3.id)

    // Clean table 2
    await app.service('column').remove(table2ColumnVirtualLookedUpColumnTable1Text.id)
    await app.service('column').remove(table2ColumnVirtualLookedUpColumnTable1TextBis.id)
    await app.service('column').remove(table2ColumnRelationBetweenTable1.id)
    await app.service('table').remove(table2.id)

    // Clean table 1
    await app.service('column').remove(table1ColumnText.id)
    await app.service('table').remove(table1.id)

    // Clean user
    await app.service('user').remove(user.id)
    // await app.service('authentication').remove(authentication.id, {})

    // Clean workspace
    await dropWorkspace(app, workspace.id)
  })
})
