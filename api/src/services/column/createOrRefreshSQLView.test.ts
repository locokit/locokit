import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Knex from 'knex'
import app from '../../app'
import { Workspace } from '../../models/workspace.model'
import { dropWorkspace } from '../../utils/dropWorkspace'

const workspaceService = app.services.workspace
const knexService = app.get('knex') as Knex

describe('createOrRefreshSQLView hook', () => {
  let workspaceTestTableSQLView: Workspace
  let databaseId: string
  beforeAll(async () => {
    workspaceTestTableSQLView = await workspaceService.create({
      text: 'Workspace for testing sql view on columns',
      slug: 'workspace_test_column_sql_view',
      generate_sql: true,
    })
    databaseId = workspaceTestTableSQLView.databases?.[0].id as string
  })

  it('remove a column in a table view if a column is removed', async () => {
    expect.assertions(1)

    const table = await app.services.table.create({
      database_id: databaseId,
      text: 'First table',
      slug: 'first_table',
    })

    const column = await app.services.column.create({
      table_id: table.id,
      text: 'First column',
      column_type_id: COLUMN_TYPE.STRING,
      slug: 'first_column',
    })

    const row = await app.services.row.create({
      table_id: table.id,
      data: {
        [column.id]: 'Text sample',
      },
    })

    const tableViewData = await knexService.select()
      .from('workspace_test_column_sql_view.first_table')

    expect(tableViewData[0].first_column).toBe('Text sample')

    await app.services.row.remove(row.id)
    await app.services.column.remove(column.id)
    await app.services.table.remove(table.id)
  })

  it('rename the column if the slug of the column is patched', async () => {
    expect.assertions(3)

    const table = await app.services.table.create({
      database_id: databaseId,
      text: 'First table',
      slug: 'first_table',
    })

    const column = await app.services.column.create({
      table_id: table.id,
      text: 'First column',
      column_type_id: COLUMN_TYPE.STRING,
      slug: 'first_column',
    })

    const row = await app.services.row.create({
      table_id: table.id,
      data: {
        [column.id]: 'Text sample',
      },
    })

    const tableViewData = await knexService.select()
      .from('workspace_test_column_sql_view.first_table')

    expect(tableViewData[0].first_column).toBe('Text sample')

    await app.services.column.patch(column.id, {
      slug: 'other_column',
    })

    const tableViewData1 = await knexService.select()
      .from('workspace_test_column_sql_view.first_table')

    expect(tableViewData1[0].first_column).toBeUndefined()
    expect(tableViewData1[0].other_column).toBe('Text sample')

    await app.services.row.remove(row.id)
    await app.services.column.remove(column.id)
    await app.services.table.remove(table.id)
  })

  it('remove the column of a view if a column is dropped', async () => {
    expect.assertions(4)

    const table = await app.services.table.create({
      database_id: databaseId,
      text: 'First table',
      slug: 'first_table',
    })

    const column1 = await app.services.column.create({
      table_id: table.id,
      text: 'First column',
      column_type_id: COLUMN_TYPE.STRING,
      slug: 'first_column',
    })

    const column2 = await app.services.column.create({
      table_id: table.id,
      text: 'Second column',
      column_type_id: COLUMN_TYPE.NUMBER,
      slug: 'second_column',
    })

    const row = await app.services.row.create({
      table_id: table.id,
      data: {
        [column1.id]: 'Text sample',
        [column2.id]: 42,
      },
    })

    const tableViewData = await knexService.select()
      .from('workspace_test_column_sql_view.first_table')

    expect(tableViewData[0].first_column).toBe('Text sample')
    expect(tableViewData[0].second_column).toBe(42)

    await app.services.column.remove(column2.id)

    const tableViewData1 = await knexService.select()
      .from('workspace_test_column_sql_view.first_table')

    expect(tableViewData1[0].second_column).toBeUndefined()
    expect(tableViewData1[0].first_column).toBe('Text sample')

    await app.services.row.remove(row.id)
    await app.services.column.remove(column1.id)
    await app.services.table.remove(table.id)
  })

  it('forbid the creation of a column with the same slug of an existent column in the same table', async () => {
    expect.assertions(1)

    const table = await app.services.table.create({
      database_id: databaseId,
      text: 'First table',
      slug: 'first_table',
    })

    const column1 = await app.services.column.create({
      table_id: table.id,
      text: 'First column',
      column_type_id: COLUMN_TYPE.STRING,
      slug: 'first_column',
    })

    await expect(app.services.column.create({
      table_id: table.id,
      text: 'Second column',
      column_type_id: COLUMN_TYPE.NUMBER,
      slug: 'first_column',
    })).rejects.toThrow()

    await app.services.column.remove(column1.id)
    await app.services.table.remove(table.id)
  })

  /**
   * Tests some specific column types ?
   */

  afterAll(async () => {
    await dropWorkspace(app, workspaceTestTableSQLView.id)
  })
})
