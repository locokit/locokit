import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { Database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { Paginated } from '@feathersjs/feathers'
import { TableView } from '../../models/tableview.model'
import { NotAcceptable } from '@feathersjs/errors'
import { Group } from '../../models/group.model'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('filterRowsByTableViewId hook', () => {
  let workspace: Workspace
  let database: Database
  let table1: Table
  let table2: Table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable1Group: TableColumn
  let columnTable1FirstName: TableColumn
  let columnTable1LastName: TableColumn
  let columnTable1Geom: TableColumn
  let columnTable1Number: TableColumn
  let columnTable1RelationBetweenTables: TableColumn
  let columnTable1LookedUpColumnRef: TableColumn
  let columnTable1LookedUpColumnUser: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2User: TableColumn
  let user1: User
  let user2: User
  let user3: User
  let group1: Group
  let group2: Group
  let table1Row1: TableRow
  let table1Row2: TableRow
  let table1Row3: TableRow
  let table2Row1: TableRow
  let table2Row2: TableRow

  beforeAll(async () => {
    // Workspace
    workspace = await app.service('workspace').create({ text: 'pouet' })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    // Database
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
    // Columns
    columnTable2Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    columnTable2User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table2.id,
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
      text: 'Geom point',
      column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
      table_id: table1.id,
      reference: false,
      reference_position: 0,
    })
    columnTable1Number = await app.service('column').create({
      text: 'Number',
      column_type_id: COLUMN_TYPE.NUMBER,
      table_id: table1.id,
      reference: false,
      reference_position: 0,
    })
    columnTable1RelationBetweenTables = await app.service('column').create({
      text: 'Relation between tables',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table1.id,
      reference: false,
      reference_position: 0,
      settings: {
        tableId: table2.id,
      },
    })
    columnTable1LookedUpColumnRef = await app.service('column').create({
      text: 'Looked up column ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table1.id,
      reference: false,
      reference_position: 0,
      settings: {
        localField: columnTable1RelationBetweenTables.id,
        foreignField: columnTable2Ref.id,
      },
    })
    columnTable1LookedUpColumnUser = await app.service('column').create({
      text: 'Looked up column user',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table1.id,
      reference: false,
      reference_position: 0,
      settings: {
        localField: columnTable1RelationBetweenTables.id,
        foreignField: columnTable2User.id,
      },
    })
    columnTable1Group = await app.service('column').create({
      text: 'Group',
      column_type_id: COLUMN_TYPE.GROUP,
      table_id: table1.id,
    })
    columnTable1MultiUser = await app.service('column').create({
      text: 'Multi user',
      column_type_id: COLUMN_TYPE.MULTI_USER,
      table_id: table1.id,
    })
    // Groups
    group1 = await app.service('group').create({
      name: 'Group 1',
    })
    group2 = await app.service('group').create({
      name: 'Group 2',
    })
    // Users
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1-table-view@locokit.io',
      password: 'locokit',
    })
    user2 = await app.service('user').create({
      name: 'User 2',
      email: 'user2-table-view@locokit.io',
      password: 'locokit',
    })
    user3 = await app.service('user').create({
      name: 'User 3',
      email: 'user3-table-view@locokit.io',
      password: 'locokit',
    })
    // Rows
    table2Row1 = await app.service('row').create({
      table_id: table2.id,
      text: 'table 2 ref 1',
      data: {
        [columnTable2Ref.id]: 'this is the first table 2 row',
        [columnTable2User.id]: user1.id,
      },
    })
    table2Row2 = await app.service('row').create({
      table_id: table2.id,
      text: 'table 2 ref 2',
      data: {
        [columnTable2Ref.id]: 'this is the second table 2 row',
        [columnTable2User.id]: user2.id,
      },
    })
    table1Row1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 1',
      data: {
        [columnTable1Ref.id]: 'this is a ref',
        [columnTable1FirstName.id]: 'first name 1',
        [columnTable1LastName.id]: 'last name',
        [columnTable1User.id]: user1.id,
        [columnTable1Group.id]: group1.id,
        [columnTable1MultiUser.id]: [user1.id, user2.id],
        [columnTable1Geom.id]: 'SRID=4326;POINT (29.00390625 54.546579538405)',
        [columnTable1Number.id]: 2,
        [columnTable1RelationBetweenTables.id]: table2Row1.id,
      },
    })
    table1Row2 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 2',
      data: {
        [columnTable1Ref.id]: 'no way table 2',
        [columnTable1FirstName.id]: 'first name 1',
        [columnTable1LastName.id]: 'last name',
        [columnTable1User.id]: user1.id,
        [columnTable1Group.id]: group1.id,
        [columnTable1MultiUser.id]: [user1.id],
        [columnTable1Geom.id]: 'SRID=4326;POINT (29.00390625 54.546579538405)',
        [columnTable1Number.id]: 17,
        [columnTable1RelationBetweenTables.id]: table2Row2.id,
      },
    })
    table1Row3 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 ref 3',
      data: {
        [columnTable1Ref.id]: 'lucky table 3',
        [columnTable1FirstName.id]: 'first name',
        [columnTable1LastName.id]: 'last name',
        [columnTable1User.id]: user2.id,
        [columnTable1Group.id]: group2.id,
        [columnTable1MultiUser.id]: [user2.id],
        [columnTable1Geom.id]: 'SRID=4326;POINT (29.00390625 54.546579538405)',
        [columnTable1Number.id]: 42,
        [columnTable1RelationBetweenTables.id]: null,
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
    expect(rows.data[0].id).toBe(table1Row3.id)
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
    if (rows.data[0].id === table1Row3.id) {
      expect(rows.data[0].id).toBe(table1Row3.id)
      expect(rows.data[1].id).toBe(table1Row2.id)
    } else {
      expect(rows.data[0].id).toBe(table1Row2.id)
      expect(rows.data[1].id).toBe(table1Row3.id)
    }
    await app.service('view').remove(tableView.id)
  })

  it('restrict view rows to the filter $gte', async () => {
    const tableView = await app.service('view').create({
      text: 'My view',
      table_id: table1.id,
    }) as TableView
    await app.service('table-view-has-table-column').create({
      table_view_id: tableView.id,
      table_column_id: columnTable1Number.id,
      filter: {
        $gte: 17,
      },
    })
    const rows = await app.service('row').find({ query: { table_view_id: tableView.id } }) as Paginated<TableRow>
    expect.assertions(1)
    expect(rows.total).toBe(2)
    await app.service('view').remove(tableView.id)
  })

  it('restrict view rows to the filter $lt', async () => {
    const tableView = await app.service('view').create({
      text: 'My view',
      table_id: table1.id,
    }) as TableView
    await app.service('table-view-has-table-column').create({
      table_view_id: tableView.id,
      table_column_id: columnTable1Number.id,
      filter: {
        $lt: 17,
      },
    })
    const rows = await app.service('row').find({ query: { table_view_id: tableView.id } }) as Paginated<TableRow>
    expect.assertions(1)
    expect(rows.total).toBe(1)
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

  describe('restrict view rows to the table view filter', () => {
    describe('return the specific rows if there is one default filter', () => {
      it('With string column', async () => {
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'equal',
                column: columnTable1Ref.id,
                dbAction: '$eq',
                pattern: 'this is a ref',
              },
              {
                action: 'ilike',
                column: columnTable1Ref.id,
                dbAction: '$ilike',
                pattern: '%table 2%',
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1Ref.id,
        })
        // Get rows from this table view
        const rows = await app.service('row').find({
          query: {
            table_view_id: tableView.id,
            $sort: {
              text: 1,
            },
          },
        }) as Paginated<TableRow>
        // Check that we only retrieve the specified rows
        expect.assertions(3)
        expect(rows.total).toBe(2)
        expect(rows.data[0].id).toBe(table1Row1.id)
        expect(rows.data[1].id).toBe(table1Row2.id)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
      it('With number column', async () => {
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'equal',
                column: columnTable1Number.id,
                dbAction: '$lt',
                pattern: 20,
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1Number.id,
        })
        // Get rows from this table view
        const rows = await app.service('row').find({
          query: {
            table_view_id: tableView.id,
            $sort: {
              text: 1,
            },
          },
        }) as Paginated<TableRow>
        // Check that we only retrieve the specified rows
        expect.assertions(3)
        expect(rows.total).toBe(2)
        expect(rows.data[0].id).toBe(table1Row1.id)
        expect(rows.data[1].id).toBe(table1Row2.id)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
      it('With user column', async () => {
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'equal',
                column: columnTable1User.id,
                dbAction: '$eq',
                pattern: '{userId}',
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1User.id,
        })
        // Get rows from this table view
        const rows = await app.service('row').find({
          query: {
            table_view_id: tableView.id,
          },
          user: user2,
        }) as Paginated<TableRow>
        // Check that we only retrieve the specified rows
        expect.assertions(2)
        expect(rows.total).toBe(1)
        expect(rows.data[0].id).toBe(table1Row3.id)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
      it('With group column', async () => {
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'equal',
                column: columnTable1Group.id,
                dbAction: '$eq',
                pattern: '{groupId}',
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1Group.id,
        })
        // Get rows from this table view
        const rows = await app.service('row').find({
          query: {
            table_view_id: tableView.id,
            $lckGroupId: group1.id,
            $sort: {
              text: 1,
            },
          },
        }) as Paginated<TableRow>
        // Check that we only retrieve the specified rows
        expect.assertions(3)
        expect(rows.total).toBe(2)
        expect(rows.data[0].id).toBe(table1Row1.id)
        expect(rows.data[1].id).toBe(table1Row2.id)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
      it('With multi user column', async () => {
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'contains',
                column: columnTable1MultiUser.id,
                dbAction: '$contains',
                pattern: ['{userId}'],
              },
              {
                action: 'contains',
                column: columnTable1MultiUser.id,
                dbAction: '$contains',
                pattern: [user3.id],
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1MultiUser.id,
        })
        // Get rows from this table view
        const rows = await app.service('row').find({
          query: {
            table_view_id: tableView.id,
            $sort: {
              text: 1,
            },
          },
          user: user2,
        }) as Paginated<TableRow>
        // Check that we only retrieve the specified rows
        expect.assertions(3)
        expect(rows.total).toBe(2)
        expect(rows.data[0].id).toBe(table1Row1.id)
        expect(rows.data[1].id).toBe(table1Row3.id)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
      it('With relation between tables column', async () => {
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'equal',
                column: columnTable1RelationBetweenTables.id,
                dbAction: '$eq',
                pattern: table2Row2.text,
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1RelationBetweenTables.id,
        })
        // Get rows from this table view
        const rows = await app.service('row').find({
          query: {
            table_view_id: tableView.id,
          },
        }) as Paginated<TableRow>
        // Check that we only retrieve the specified rows
        expect.assertions(2)
        expect(rows.total).toBe(1)
        expect(rows.data[0].id).toBe(table1Row2.id)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
      it('With string looked up column', async () => {
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'match',
                column: columnTable1LookedUpColumnRef.id,
                dbAction: '$ilike',
                pattern: '%first%',
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1LookedUpColumnRef.id,
        })
        // Get rows from this table view
        const rows = await app.service('row').find({
          query: {
            table_view_id: tableView.id,
          },
        }) as Paginated<TableRow>
        // Check that we only retrieve the specified rows
        expect.assertions(2)
        expect(rows.total).toBe(1)
        expect(rows.data[0].id).toBe(table1Row1.id)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
      it('With user looked up column', async () => {
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'isEqualTo',
                column: columnTable1LookedUpColumnUser.id,
                dbAction: '$eq',
                pattern: user2.id,
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1LookedUpColumnUser.id,
        })
        // Get rows from this table view
        const rows = await app.service('row').find({
          query: {
            table_view_id: tableView.id,
          },
        }) as Paginated<TableRow>
        // Check that we only retrieve the specified rows
        expect.assertions(2)
        expect(rows.total).toBe(1)
        expect(rows.data[0].id).toBe(table1Row2.id)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
    })

    it('return the specific rows if there is one default filter and one column filter', async () => {
      // Create the table view with default filter
      const tableView = await app.service('view').create({
        text: 'My view',
        table_id: table1.id,
        filter: {
          operator: '$or',
          values: [
            {
              action: 'equal',
              column: columnTable1Ref.id,
              dbAction: '$eq',
              pattern: 'this is a ref',
            },
            {
              action: 'ilike',
              column: columnTable1Ref.id,
              dbAction: '$ilike',
              pattern: '%lucky%',
            },
          ],
        },
      }) as TableView
      // Add the column to the table view
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1Ref.id,
      })
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1User.id,
        filter: {
          $eq: user1.id,
        },
      })
      // Get rows from this table view
      const rows = await app.service('row').find({
        query: {
          table_view_id: tableView.id,
        },
      }) as Paginated<TableRow>
      // Check that we only retrieve the specified rows
      expect.assertions(2)
      expect(rows.total).toBe(1)
      expect(rows.data[0].id).toBe(table1Row1.id)
      // Clean database
      await app.service('view').remove(tableView.id)
    })

    it('throw an exception if the specified column is not in the table view', async () => {
      // Create the table view with default filter
      const tableView = await app.service('view').create({
        text: 'My view',
        table_id: table1.id,
        filter: {
          operator: '$and',
          values: [
            {
              action: 'equal',
              column: 'unknown',
              dbAction: '$eq',
              pattern: 'this is a ref',
            },
          ],
        },
      }) as TableView
      // Add the column to the table view
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1Ref.id,
      })
      // Check that an exception is thrown
      expect.assertions(1)
      await expect(app.service('row').find({
        query: {
          table_view_id: tableView.id,
        },
      })).rejects.toThrow(NotAcceptable)
      // Clean database
      await app.service('view').remove(tableView.id)
    })

    it('throw an exception if the table view has no column', async () => {
      // Create the table view with default filter
      const tableView = await app.service('view').create({
        text: 'My view',
        table_id: table1.id,
        filter: {
          operator: '$and',
          values: [
            {
              action: 'equal',
              column: columnTable1Ref.id,
              dbAction: '$eq',
              pattern: 'this is a ref',
            },
          ],
        },
      }) as TableView
      // Check that an exception is thrown
      expect.assertions(1)
      await expect(app.service('row').find({
        query: {
          table_view_id: tableView.id,
        },
      })).rejects.toThrow(NotAcceptable)
      // Clean database
      await app.service('view').remove(tableView.id)
    })

    describe('Throw an exception if a specific key is not provided', () => {
      it('With a user column', async () => {
        expect.assertions(1)
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'equal',
                column: columnTable1User.id,
                dbAction: '$eq',
                pattern: '{userId}',
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1User.id,
        })
        // Try to get rows from this table view
        await expect(async () => {
          await app.service('row').find({
            query: {
              table_view_id: tableView.id,
            },
          })
        }).rejects.toThrowError(NotAcceptable)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
      it('With a group column', async () => {
        expect.assertions(1)
        // Create the table view with default filter
        const tableView = await app.service('view').create({
          text: 'My view',
          table_id: table1.id,
          filter: {
            operator: '$or',
            values: [
              {
                action: 'equal',
                column: columnTable1Group.id,
                dbAction: '$eq',
                pattern: '{groupId}',
              },
            ],
          },
        }) as TableView
        // Add the column to the table view
        await app.service('table-view-has-table-column').create({
          table_view_id: tableView.id,
          table_column_id: columnTable1Group.id,
        })
        // Try to get rows from this table view
        await expect(async () => {
          await app.service('row').find({
            query: {
              table_view_id: tableView.id,
            },
          })
        }).rejects.toThrowError(NotAcceptable)
        // Clean database
        await app.service('view').remove(tableView.id)
      })
    })

    it('return all the rows if the default filter has no value', async () => {
      // Create the table view with default filter
      const tableView = await app.service('view').create({
        text: 'My view',
        table_id: table1.id,
        filter: {
          operator: '$and',
          values: [],
        },
      }) as TableView
      // Add the column to the table view
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1Ref.id,
      })
      // Get rows from this table view
      const rows = await app.service('row').find({
        query: {
          table_view_id: tableView.id,
        },
      }) as Paginated<TableRow>
      // Check that we only retrieve the specified rows
      expect.assertions(1)
      expect(rows.total).toBe(3)
      // Clean database
      await app.service('view').remove(tableView.id)
    })

    it('return the specific rows if there is one default filter ($and operator) and another one which is specified in the request ($and operator)', async () => {
      // Create the table view with default filter
      const tableView = await app.service('view').create({
        text: 'My view',
        table_id: table1.id,
        filter: {
          operator: '$and',
          values: [
            {
              action: 'equal',
              column: columnTable1FirstName.id,
              dbAction: '$eq',
              pattern: 'first name 1',
            },
          ],
        },
      }) as TableView
      // Add the column to the table view
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1FirstName.id,
      })
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1Ref.id,
      })
      // Get rows from this table view
      const rows = await app.service('row').find({
        query: {
          table_view_id: tableView.id,
          $and: [
            { data: { [columnTable1Ref.id]: 'this is a ref' } },
          ],
        },
      }) as Paginated<TableRow>
      // Check that we only retrieve the specified rows
      expect.assertions(2)
      expect(rows.total).toBe(1)
      expect(rows.data[0].id).toBe(table1Row1.id)
      // Clean database
      await app.service('view').remove(tableView.id)
    })

    it('return the specific rows if there is one default filter ($and operator) and another one which is specified in the request ($or operator)', async () => {
      // Create the table view with default filter
      const tableView = await app.service('view').create({
        text: 'My view',
        table_id: table1.id,
        filter: {
          operator: '$and',
          values: [
            {
              action: 'equal',
              column: columnTable1FirstName.id,
              dbAction: '$eq',
              pattern: 'first name 1',
            },
          ],
        },
      }) as TableView
      // Add the column to the table view
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1FirstName.id,
      })
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1Ref.id,
      })
      // Get rows from this table view
      const rows = await app.service('row').find({
        query: {
          table_view_id: tableView.id,
          $or: [
            {
              data: { [columnTable1Ref.id]: 'this is a ref' },
            },
          ],
        },
      }) as Paginated<TableRow>
      // Check that we only retrieve the specified rows
      expect.assertions(2)
      expect(rows.total).toBe(1)
      expect(rows.data[0].id).toBe(table1Row1.id)
      // Clean database
      await app.service('view').remove(tableView.id)
    })

    it('return the specific rows if there is one default filter ($or operator) and another one which is specified in the request ($or operator)', async () => {
      // Create the table view with default filter
      const tableView = await app.service('view').create({
        text: 'My view',
        table_id: table1.id,
        filter: {
          operator: '$or',
          values: [
            {
              action: 'equal',
              column: columnTable1FirstName.id,
              dbAction: '$eq',
              pattern: 'first name 1',
            },
            {
              action: 'equal',
              column: columnTable1FirstName.id,
              dbAction: '$eq',
              pattern: 'first name',
            },
          ],
        },
      }) as TableView
      // Add the column to the table view
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1FirstName.id,
      })
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1Ref.id,
      })
      // Get rows from this table view
      const rows = await app.service('row').find({
        query: {
          table_view_id: tableView.id,
          $or: [
            { data: { [columnTable1Ref.id]: 'this is a ref' } },
            { data: { [columnTable1Ref.id]: 'lucky table 3' } },
          ],
          $sort: {
            text: 1,
          },
        },
      }) as Paginated<TableRow>
      // Check that we only retrieve the specified rows
      expect.assertions(3)
      expect(rows.total).toBe(2)
      expect(rows.data[0].id).toBe(table1Row1.id)
      expect(rows.data[1].id).toBe(table1Row3.id)
      // Clean database
      await app.service('view').remove(tableView.id)
    })

    it('return the specific rows if there is one default filter ($or operator) and another one which is specified in the request ($and operator)', async () => {
      // Create the table view with default filter
      const tableView = await app.service('view').create({
        text: 'My view',
        table_id: table1.id,
        filter: {
          operator: '$and',
          values: [
            {
              action: 'ilike',
              column: columnTable1FirstName.id,
              dbAction: '$ilike',
              pattern: '%first name 1%',
            },
            {
              action: 'equal',
              column: columnTable1Ref.id,
              dbAction: '$ne',
              pattern: 'elt',
            },
          ],
        },
      }) as TableView
      // Add the column to the table view
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1FirstName.id,
      })
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1Ref.id,
      })
      await app.service('table-view-has-table-column').create({
        table_view_id: tableView.id,
        table_column_id: columnTable1LastName.id,
      })
      // Get rows from this table view
      const rows = await app.service('row').find({
        query: {
          table_view_id: tableView.id,
          $and: [
            { data: { [columnTable1LastName.id]: { $ilike: '%last%' } } },
            { data: { [columnTable1Ref.id]: 'this is a ref' } },
          ],
        },
      }) as Paginated<TableRow>
      // Check that we only retrieve the specified rows
      expect.assertions(2)
      expect(rows.total).toBe(1)
      expect(rows.data[0].id).toBe(table1Row1.id)
      // Clean database
      await app.service('view').remove(tableView.id)
    })
  })

  afterAll(async () => {
    await app.service('row').remove(table1Row3.id)
    await app.service('row').remove(table1Row2.id)
    await app.service('row').remove(table1Row1.id)
    await app.service('row').remove(table2Row1.id)
    await app.service('row').remove(table2Row2.id)
    await app.service('group').remove(group1.id)
    await app.service('group').remove(group2.id)
    await app.service('user').remove(user1.id)
    await app.service('user').remove(user2.id)
    await app.service('user').remove(user3.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('column').remove(columnTable1FirstName.id)
    await app.service('column').remove(columnTable1LastName.id)
    await app.service('column').remove(columnTable1Geom.id)
    await app.service('column').remove(columnTable1Number.id)
    await app.service('column').remove(columnTable1RelationBetweenTables.id)
    await app.service('column').remove(columnTable1MultiUser.id)
    await app.service('column').remove(columnTable1Group.id)
    await app.service('column').remove(columnTable1LookedUpColumnRef.id)
    await app.service('column').remove(columnTable1LookedUpColumnUser.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2User.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await dropWorkspace(app, workspace.id)
  })
})
