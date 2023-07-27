/**
 * Create an environment with users and super admins
 *
 * 5 users are created, and one admin user.
 *
 * A public workspace is created and affected to the user 1.
 */
import { AuthenticationResult } from '@feathersjs/authentication/lib'
import { LocalStrategy } from '@feathersjs/authentication-local/lib/strategy'

import { SERVICES, USER_PROFILE } from '@locokit/definitions'

import { createApp } from './app'
import { UserResult } from './services/core/user/user.schema'
import { WorkspaceResult } from './services/core/workspace/core-workspace.schema'

const app = createApp()

export interface SetupData {
  publicWorkspaceId: string
  // workspace2Id: string
  // database1Id: string
  // database2Id: string
  // columnTable1GroupId: string
  // columnTable1UserId: string
  // columnTable1BooleanId: string
  // columnTable1FormulaId: string
  // columnTable2LkdUpGroupId: string
  // columnTable2LkdUpUserId: string
  // columnTable1W2Ref: string
  // columnTable1W2Name: string
  user1: UserResult
  user2: UserResult
  user3: UserResult
  user4: UserResult
  user5: UserResult
  userAdmin: UserResult
  userBlocked: UserResult
  user1Authentication: AuthenticationResult
  user2Authentication: AuthenticationResult
  user3Authentication: AuthenticationResult
  user4Authentication: AuthenticationResult
  user5Authentication: AuthenticationResult
  userAdminAuthentication: AuthenticationResult
  // group1: Group
  // group2: Group
  // group3: Group
  // group4: Group
  // group5: Group
  // aclset1: LckAclSet
  // aclset2: LckAclSet
  // aclset3: LckAclSet
  // aclset4: LckAclSet
  // aclset5: LckAclSet
  // table1Id: string
  // table2Id: string
  // table1Workspace2Id: string
  // row1Table1: TableRow
  // row2Table1: TableRow
  // row3Table1: TableRow
  // row4Table1: TableRow
  // row1Table2: TableRow
  // row2Table2: TableRow
  // row3Table2: TableRow
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function builderTestEnvironment(prefix: string) {
  /**
   * Create all necessary resources for testing use case
   * * several workspaces
   * * several aclset
   * * several groups
   * * several users
   *
   * This builder is a singleton.
   * Use it once, and after reuse it,
   * it won't setup data again, just return already injected.
   */
  let _data: SetupData
  let publicWorkspace: WorkspaceResult
  // let workspace2: Workspace
  // let database1: Database
  // let database2: Database
  // let aclset1: LckAclSet
  // let aclset2: LckAclSet
  // let aclset3: LckAclSet
  // let aclset4: LckAclSet
  // let aclset5: LckAclSet
  // let group1: Group
  // let group2: Group
  // let group3: Group
  // let group4: Group
  // let group5: Group
  let user1: UserResult
  let user2: UserResult
  let user3: UserResult
  let user4: UserResult
  let user5: UserResult
  let userAdmin: UserResult
  let userBlocked: UserResult
  let user1Authentication: AuthenticationResult
  let user2Authentication: AuthenticationResult
  let user3Authentication: AuthenticationResult
  let user4Authentication: AuthenticationResult
  let user5Authentication: AuthenticationResult
  let userAdminAuthentication: AuthenticationResult

  // let table1: Table
  // let table2: Table
  // let table1Workspace2: Table
  // let columnTable1Boolean: TableColumn
  // let columnTable1Number: TableColumn
  // let columnTable1Date: TableColumn
  // let columnTable1DateTime: TableColumn
  // let columnTable1String: TableColumn
  // let columnTable1Float: TableColumn
  // let columnTable1User: TableColumn
  // let columnTable1Group: TableColumn
  // let columnTable1SingleSelect: TableColumn
  // let columnTable1MultiSelect: TableColumn
  // let columnTable1Formula: TableColumn
  // let columnTable1File: TableColumn
  // let columnTable1MultiUser: TableColumn
  // let columnTable1MultiGroup: TableColumn
  // let columnTable1Text: TableColumn
  // let columnTable1URL: TableColumn
  // let columnTable1GeomPoint: TableColumn
  // let columnTable1GeomPolygon: TableColumn
  // let columnTable1GeomLinestring: TableColumn
  // let columnTable2Ref: TableColumn
  // let columnTable2Name: TableColumn
  // let columnTable2RelationBetweenTables: TableColumn
  // let columnTable2LkdUpGroup: TableColumn
  // let columnTable2LkdUpUser: TableColumn
  // let columnTable1W2Ref: TableColumn
  // let columnTable1W2Name: TableColumn
  // let row1Table1: TableRow
  // let row2Table1: TableRow
  // let row3Table1: TableRow
  // let row4Table1: TableRow
  // let row1Table2: TableRow
  // let row2Table2: TableRow
  // let row3Table2: TableRow

  async function setupWorkspace(): Promise<SetupData> {
    /**
     * If _data already exist, we don't want to reinject setup data.
     * We just return it.
     */
    if (_data) return _data

    // workspace2 = await app.services.workspace.create({
    //   text: `[${prefix} abilities] Workspace 2`,
    // })
    // const workspaceDatabases = (await app.service('database').find({
    //   query: {
    //     workspace_id: workspace1.id,
    //     $limit: 1,
    //   },
    // })) as Paginated<Database>
    // database1 = workspaceDatabases.data[0]
    // const workspace2Databases = (await app.service('database').find({
    //   query: {
    //     workspace_id: workspace2.id,
    //     $limit: 1,
    //   },
    // })) as Paginated<Database>
    // database2 = workspace2Databases.data[0]
    // aclset1 = await app.services.aclset.create({
    //   label: `[${prefix} abilities] Acl Set 1 workspace 1`,
    //   workspace_id: workspace1.id,
    //   manager: true,
    // })
    // aclset2 = await app.services.aclset.create({
    //   label: `[${prefix} abilities] Acl Set 2 workspace 1`,
    //   workspace_id: workspace1.id,
    // })
    // aclset3 = await app.services.aclset.create({
    //   label: `[${prefix} abilities] Acl Set 3 workspace 2`,
    //   workspace_id: workspace2.id,
    //   manager: true,
    // })
    // aclset4 = await app.services.aclset.create({
    //   label: `[${prefix} abilities] Acl Set 4 workspace 2`,
    //   workspace_id: workspace2.id,
    // })
    // aclset5 = await app.services.aclset.create({
    //   label: `[${prefix} abilities] Acl Set 5 workspace 1`,
    //   workspace_id: workspace1.id,
    // })
    const userPassword = 'locokit'
    const [localStrategy] = app
      .service(SERVICES.AUTH_AUTHENTICATION)
      .getStrategies('local') as LocalStrategy[]
    const passwordHashed = await localStrategy.hashPassword(userPassword, {})
    // @ts-expect-error this should work as expected but don't respect the schemas
    user1 = await app.service(SERVICES.CORE_USER)._create(
      {
        username: 'User 1',
        email: `${prefix}abilities-user1@locokit.io`,
        isVerified: true,
        password: passwordHashed,
        profile: USER_PROFILE.CREATOR,
      },
      {},
    )
    // @ts-expect-error this should work as expected but don't respect the schemas
    user2 = await app.service(SERVICES.CORE_USER)._create(
      {
        username: 'User 2',
        email: `${prefix}abilities-user2@locokit.io`,
        isVerified: true,
        password: passwordHashed,
        firstName: 'User',
        lastName: 'Two',
      },
      {},
    )
    // @ts-expect-error this should work as expected but don't respect the schemas
    user3 = await app.service(SERVICES.CORE_USER)._create(
      {
        username: 'User 3',
        email: `${prefix}abilities-user3@locokit.io`,
        isVerified: true,
        password: passwordHashed,
      },
      {},
    )
    // @ts-expect-error this should work as expected but don't respect the schemas
    user4 = await app.service(SERVICES.CORE_USER)._create(
      {
        username: 'User 4',
        email: `${prefix}abilities-user4@locokit.io`,
        isVerified: true,
        password: passwordHashed,
      },
      {},
    )
    // @ts-expect-error this should work as expected but don't respect the schemas
    user5 = await app.service(SERVICES.CORE_USER)._create(
      {
        username: 'User 5',
        email: `${prefix}abilities-user5@locokit.io`,
        isVerified: true,
        password: passwordHashed,
      },
      {},
    )
    // @ts-expect-error this should work as expected but don't respect the schemas
    userAdmin = await app.service(SERVICES.CORE_USER)._create(
      {
        username: 'Admin',
        email: `${prefix}admin@locokit.io`,
        isVerified: true,
        password: passwordHashed,
        profile: USER_PROFILE.ADMIN,
      },
      {},
    )
    // @ts-expect-error this should work as expected but don't respect the schemas
    userBlocked = await app.service(SERVICES.CORE_USER)._create(
      {
        username: 'Blocked User',
        email: `${prefix}abilities-user-blocked@locokit.io`,
        isVerified: true,
        blocked: true,
        password: passwordHashed,
      },
      {},
    )

    user1Authentication = await app.service(SERVICES.AUTH_AUTHENTICATION).create(
      {
        strategy: 'local',
        email: `${prefix}abilities-user1@locokit.io`,
        password: userPassword,
      },
      {},
    )
    user2Authentication = await app.service(SERVICES.AUTH_AUTHENTICATION).create(
      {
        strategy: 'local',
        email: `${prefix}abilities-user2@locokit.io`,
        password: userPassword,
      },
      {},
    )
    user3Authentication = await app.service(SERVICES.AUTH_AUTHENTICATION).create(
      {
        strategy: 'local',
        email: `${prefix}abilities-user3@locokit.io`,
        password: userPassword,
      },
      {},
    )
    user4Authentication = await app.service(SERVICES.AUTH_AUTHENTICATION).create(
      {
        strategy: 'local',
        email: `${prefix}abilities-user4@locokit.io`,
        password: userPassword,
      },
      {},
    )
    user5Authentication = await app.service(SERVICES.AUTH_AUTHENTICATION).create(
      {
        strategy: 'local',
        email: `${prefix}abilities-user5@locokit.io`,
        password: userPassword,
      },
      {},
    )
    userAdminAuthentication = await app.service(SERVICES.AUTH_AUTHENTICATION).create(
      {
        strategy: 'local',
        email: `${prefix}admin@locokit.io`,
        password: userPassword,
      },
      {},
    )

    publicWorkspace = await app.service(SERVICES.CORE_WORKSPACE).create({
      name: `[${prefix}] Public workspace 1`,
      documentation: 'Public workspace for user1',
      createdBy: user1.id,
      public: true,
    })

    // group1 = await app.services.group.create({
    //   name: `[${prefix} abilities] Group 1`,
    //   aclset_id: aclset1.id,
    //   users: [user1, user4],
    // })
    // group2 = await app.services.group.create({
    //   name: `[${prefix} abilities] Group 2`,
    //   aclset_id: aclset2.id,
    //   users: [user2, user3, user5],
    // })
    // group3 = await app.services.group.create({
    //   name: `[${prefix} abilities] Group 3`,
    //   aclset_id: aclset3.id,
    //   users: [user2],
    // })
    // group4 = await app.services.group.create({
    //   name: `[${prefix} abilities] Group 4`,
    //   aclset_id: aclset4.id,
    //   users: [user1, user5],
    // })
    // group5 = await app.services.group.create({
    //   name: `[${prefix} abilities] Group 5`,
    //   aclset_id: aclset5.id,
    //   users: [user5],
    // })

    // // let user1: User
    // // let group1: Group
    // const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
    // const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
    // const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'
    // table1 = await app.service('table').create({
    //   text: 'table1',
    //   database_id: database1.id,
    // })
    // columnTable1Boolean = await app.service('column').create({
    //   text: 'Boolean',
    //   column_type_id: COLUMN_TYPE.BOOLEAN,
    //   table_id: table1.id,
    // })
    // columnTable1Number = await app.service('column').create({
    //   text: 'Number',
    //   column_type_id: COLUMN_TYPE.NUMBER,
    //   table_id: table1.id,
    // })
    // columnTable1Date = await app.service('column').create({
    //   text: 'Date',
    //   column_type_id: COLUMN_TYPE.DATE,
    //   table_id: table1.id,
    // })
    // columnTable1DateTime = await app.service('column').create({
    //   text: 'Datetime',
    //   column_type_id: COLUMN_TYPE.DATETIME,
    //   table_id: table1.id,
    // })
    // columnTable1String = await app.service('column').create({
    //   text: 'String',
    //   column_type_id: COLUMN_TYPE.STRING,
    //   table_id: table1.id,
    // })
    // columnTable1Float = await app.service('column').create({
    //   text: 'Float',
    //   column_type_id: COLUMN_TYPE.FLOAT,
    //   table_id: table1.id,
    // })
    // columnTable1User = await app.service('column').create({
    //   text: 'User',
    //   column_type_id: COLUMN_TYPE.USER,
    //   table_id: table1.id,
    // })
    // columnTable1Group = await app.service('column').create({
    //   text: 'Group',
    //   column_type_id: COLUMN_TYPE.GROUP,
    //   table_id: table1.id,
    // })
    // columnTable1SingleSelect = await app.service('column').create({
    //   text: 'SingleSelect',
    //   column_type_id: COLUMN_TYPE.SINGLE_SELECT,
    //   table_id: table1.id,
    //   settings: {
    //     values: {
    //       [singleSelectOption1UUID]: {
    //         label: 'option 1',
    //       },
    //       [singleSelectOption2UUID]: {
    //         label: 'option 2',
    //       },
    //       [singleSelectOption3UUID]: {
    //         label: 'option 3',
    //       },
    //     },
    //   },
    // })
    // columnTable1MultiSelect = await app.service('column').create({
    //   text: 'MultiSelect',
    //   column_type_id: COLUMN_TYPE.MULTI_SELECT,
    //   table_id: table1.id,
    //   settings: {
    //     values: {
    //       [singleSelectOption1UUID]: {
    //         label: 'option 1',
    //       },
    //       [singleSelectOption2UUID]: {
    //         label: 'option 2',
    //       },
    //       [singleSelectOption3UUID]: {
    //         label: 'option 3',
    //       },
    //     },
    //   },
    // })
    // columnTable1Formula = await app.service('column').create({
    //   text: 'Formula',
    //   column_type_id: COLUMN_TYPE.FORMULA,
    //   table_id: table1.id,
    //   settings: {
    //     formula: '"MyFormulaString"',
    //   },
    // })
    // columnTable1File = await app.service('column').create({
    //   text: 'File',
    //   column_type_id: COLUMN_TYPE.FILE,
    //   table_id: table1.id,
    // })
    // columnTable1MultiUser = await app.service('column').create({
    //   text: 'MultiUser',
    //   column_type_id: COLUMN_TYPE.MULTI_USER,
    //   table_id: table1.id,
    // })
    // columnTable1MultiGroup = await app.service('column').create({
    //   text: 'MultiGroup',
    //   column_type_id: COLUMN_TYPE.MULTI_GROUP,
    //   table_id: table1.id,
    // })
    // columnTable1Text = await app.service('column').create({
    //   text: 'Text',
    //   column_type_id: COLUMN_TYPE.TEXT,
    //   table_id: table1.id,
    // })
    // columnTable1URL = await app.service('column').create({
    //   text: 'URL',
    //   column_type_id: COLUMN_TYPE.URL,
    //   table_id: table1.id,
    // })
    // columnTable1GeomPoint = await app.service('column').create({
    //   text: 'POINT',
    //   column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
    //   table_id: table1.id,
    // })
    // columnTable1GeomLinestring = await app.service('column').create({
    //   text: 'LINESTRING',
    //   column_type_id: COLUMN_TYPE.GEOMETRY_LINESTRING,
    //   table_id: table1.id,
    // })
    // columnTable1GeomPolygon = await app.service('column').create({
    //   text: 'POLYGON',
    //   column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
    //   table_id: table1.id,
    // })

    // table2 = await app.service('table').create({
    //   text: 'table2',
    //   database_id: database1.id,
    // })
    // columnTable2Ref = await app.service('column').create({
    //   text: 'Ref',
    //   column_type_id: COLUMN_TYPE.STRING,
    //   table_id: table2.id,
    // })
    // columnTable2Name = await app.service('column').create({
    //   text: 'Name',
    //   column_type_id: COLUMN_TYPE.STRING,
    //   table_id: table2.id,
    // })
    // columnTable2RelationBetweenTables = await app.service('column').create({
    //   text: 'RelationBetweenTables',
    //   column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    //   table_id: table2.id,
    //   settings: {
    //     tableId: table1.id,
    //   },
    // })
    // columnTable2LkdUpUser = await app.service('column').create({
    //   text: 'LookedUpColumn User',
    //   column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
    //   table_id: table2.id,
    //   settings: {
    //     tableId: table1.id,
    //     localField: columnTable2RelationBetweenTables.id,
    //     foreignField: columnTable1User.id,
    //   },
    // })
    // columnTable2LkdUpGroup = await app.service('column').create({
    //   text: 'LookedUpColumn Group',
    //   column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
    //   table_id: table2.id,
    //   settings: {
    //     tableId: table1.id,
    //     localField: columnTable2RelationBetweenTables.id,
    //     foreignField: columnTable1Group.id,
    //   },
    // })
    // table1Workspace2 = await app.service('table').create({
    //   text: 'table1 workspace2',
    //   database_id: database2.id,
    // })
    // columnTable1W2Ref = await app.service('column').create({
    //   text: 'Ref',
    //   column_type_id: COLUMN_TYPE.STRING,
    //   table_id: table1Workspace2.id,
    // })
    // columnTable1W2Name = await app.service('column').create({
    //   text: 'Name',
    //   column_type_id: COLUMN_TYPE.STRING,
    //   table_id: table1Workspace2.id,
    // })

    // row1Table1 = await app.service('row').create({
    //   table_id: table1.id,
    //   text: 'Row 1 Table 1',
    //   data: {
    //     [columnTable1Boolean.id]: true,
    //     [columnTable1DateTime.id]: '2021-07-05T12:00:00Z',
    //     [columnTable1String.id]: 'this is a string',
    //     [columnTable1User.id]: user1.id,
    //     [columnTable1Group.id]: group1.id,
    //   },
    // })

    // row2Table1 = await app.service('row').create({
    //   table_id: table1.id,
    //   text: 'Row 2 Table 1',
    //   data: {
    //     [columnTable1Boolean.id]: false,
    //     [columnTable1DateTime.id]: '2021-07-05T13:00:00Z',
    //     [columnTable1String.id]: 'this is a string',
    //     [columnTable1User.id]: user3.id,
    //     [columnTable1Group.id]: group3.id,
    //   },
    // })

    // row3Table1 = await app.service('row').create({
    //   table_id: table1.id,
    //   text: 'Row 3 Table 1',
    //   data: {
    //     [columnTable1Boolean.id]: true,
    //     [columnTable1DateTime.id]: '2021-07-05T14:00:00Z',
    //     [columnTable1String.id]: 'this is a string',
    //     [columnTable1User.id]: user4.id,
    //     [columnTable1Group.id]: group2.id,
    //   },
    // })

    // row4Table1 = await app.service('row').create({
    //   table_id: table1.id,
    //   text: 'Row 4 Table 1',
    //   data: {
    //     [columnTable1Boolean.id]: true,
    //     [columnTable1DateTime.id]: '2021-07-05T14:00:00Z',
    //     [columnTable1String.id]: 'this is a string',
    //     [columnTable1User.id]: user4.id,
    //     [columnTable1Group.id]: group4.id,
    //   },
    // })

    // row1Table2 = await app.service('row').create({
    //   table_id: table2.id,
    //   text: 'Row 1 Table 2',
    //   data: {
    //     [columnTable2Name.id]: 'Name 1',
    //     [columnTable2Ref.id]: 'Ref 1',
    //     [columnTable2RelationBetweenTables.id]: row1Table1.id,
    //   },
    // })

    // row2Table2 = await app.service('row').create({
    //   table_id: table2.id,
    //   text: 'Row 2 Table 2',
    //   data: {
    //     [columnTable2Name.id]: 'Name 2',
    //     [columnTable2Ref.id]: 'Ref 2',
    //     [columnTable2RelationBetweenTables.id]: row2Table1.id,
    //   },
    // })

    // row3Table2 = await app.service('row').create({
    //   table_id: table2.id,
    //   text: 'Row 3 Table 2',
    //   data: {
    //     [columnTable2Name.id]: 'Name 3',
    //     [columnTable2Ref.id]: 'Ref 3',
    //     [columnTable2RelationBetweenTables.id]: row3Table1.id,
    //   },
    // })

    _data = {
      publicWorkspaceId: publicWorkspace.id,
      user1,
      user2,
      user3,
      user4,
      user5,
      userAdmin,
      userBlocked,
      user1Authentication,
      user2Authentication,
      user3Authentication,
      user4Authentication,
      user5Authentication,
      userAdminAuthentication,
      // group1,
      // group2,
      // group3,
      // group4,
      // group5,
      // aclset1,
      // aclset2,
      // aclset3,
      // aclset4,
      // aclset5,
      // row1Table1,
      // row2Table1,
      // row3Table1,
      // row4Table1,
      // row1Table2,
      // row2Table2,
      // row3Table2,
    }

    return _data
  }

  async function teardownWorkspace(): Promise<void> {
    await app.service(SERVICES.CORE_WORKSPACE).patch(publicWorkspace.id, {
      softDeletedAt: new Date().toISOString(),
    })

    await app.service(SERVICES.CORE_WORKSPACE).remove(publicWorkspace.id, {
      user: userAdmin,
      authenticated: true,
      authentication: userAdminAuthentication,
    })

    await app.service(SERVICES.CORE_USER).remove(userAdmin.id)

    await app.service(SERVICES.CORE_USER).remove(userBlocked.id)
    await app.service(SERVICES.CORE_USER).remove(user5.id)
    await app.service(SERVICES.CORE_USER).remove(user4.id)
    await app.service(SERVICES.CORE_USER).remove(user3.id)
    await app.service(SERVICES.CORE_USER).remove(user2.id)
    await app.service(SERVICES.CORE_USER).remove(user1.id)

    /*
    await app.services.aclset.remove(aclset4.id)
    await app.services.aclset.remove(aclset3.id)
    await app.services.aclset.remove(aclset2.id)
    await app.services.aclset.remove(aclset1.id)

    await app.services.database.remove(database1.id)
    await app.services.workspace.remove(workspace1.id)
    await app.services.workspace.remove(workspace2.id)
    */
    // await dropWorkspace(app, workspace1.id)
    // await dropWorkspace(app, workspace2.id)
  }

  return {
    setupWorkspace,
    teardownWorkspace,
  }
}
