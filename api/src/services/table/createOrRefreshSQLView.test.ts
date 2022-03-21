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
      text: 'Workspace for testing sql view on a table',
      slug: 'workspace_test_table_sql_view',
      generate_sql: true,
    })
    databaseId = workspaceTestTableSQLView.databases?.[0].id as string
  })

  it('create a sql view if workspace if configured to and we create a table', async () => {
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

    const numberOfSchemaAfterCreationRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaAfterCreation = parseInt(numberOfSchemaAfterCreationRaw.rows[0].count, 10)
    expect(numberOfSchemaAfterCreation).toBe(1)

    await app.services.column.remove(column.id)
    await app.services.table.remove(table.id)
  })

  it('don t create a sql view for a table without column even if workspace if configured to', async () => {
    expect.assertions(1)

    const table = await app.services.table.create({
      database_id: databaseId,
      text: 'First table',
      slug: 'first_table',
    })

    const numberOfSchemaAfterCreationRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaAfterCreation = parseInt(numberOfSchemaAfterCreationRaw.rows[0].count, 10)

    expect(numberOfSchemaAfterCreation).toBe(0)

    await app.services.table.remove(table.id)
  })

  it('drop a sql view if we remove a table', async () => {
    expect.assertions(2)

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

    const numberOfSchemaBeforeRemoveRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaBeforeRemove = parseInt(numberOfSchemaBeforeRemoveRaw.rows[0].count, 10)

    expect(numberOfSchemaBeforeRemove).toBe(1)

    await app.services.column.remove(column.id)
    await app.services.table.remove(table.id)
    const numberOfSchemaAfterRemoveRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaAfterRemove = parseInt(numberOfSchemaAfterRemoveRaw.rows[0].count, 10)

    expect(numberOfSchemaAfterRemove).toBe(0)
  })

  it('drop/recreate a sql view if we update the slug of a table', async () => {
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

    // check the first_table view exist
    const numberOfSchemaBeforeUpdateRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaBeforeUpdate = parseInt(numberOfSchemaBeforeUpdateRaw.rows[0].count, 10)

    expect(numberOfSchemaBeforeUpdate).toBe(1)

    // patch slug
    await app.services.table.patch(table.id, {
      slug: 'other_table',
    })

    // check the old view is dropped
    const numberOfSchemaAfterUpdateOldViewRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaAfterUpdateOldView = parseInt(numberOfSchemaAfterUpdateOldViewRaw.rows[0].count, 10)

    expect(numberOfSchemaAfterUpdateOldView).toBe(0)

    // check the new view is created
    const numberOfSchemaAfterUpdateNewViewRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'other_table'])
    const numberOfSchemaAfterUpdateNewView = parseInt(numberOfSchemaAfterUpdateNewViewRaw.rows[0].count, 10)

    expect(numberOfSchemaAfterUpdateNewView).toBe(1)

    await app.services.column.remove(column.id)
    await app.services.table.remove(table.id)
  })

  it('accept to create a table without slug', async () => {
    expect.assertions(1)
    const table = await app.services.table.create({
      database_id: databaseId,
      text: 'First table',
    })
    const column = await app.services.column.create({
      table_id: table.id,
      text: 'First column',
      column_type_id: COLUMN_TYPE.STRING,
      slug: 'first_column',
    })

    const numberOfSchemaBeforeRemoveRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaBeforeRemove = parseInt(numberOfSchemaBeforeRemoveRaw.rows[0].count, 10)

    expect(numberOfSchemaBeforeRemove).toBe(1)
    await app.services.column.remove(column.id)
    await app.services.table.remove(table.id)
  })

  it('accept to patch a table without slug', async () => {
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

    await app.services.table.patch(table.id, {
      slug: null,
      text: 'First table other',
    })

    const numberOfSchemaBeforeRemoveRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table_other'])
    const numberOfSchemaBeforeRemove = parseInt(numberOfSchemaBeforeRemoveRaw.rows[0].count, 10)

    expect(numberOfSchemaBeforeRemove).toBe(1)

    await app.services.column.remove(column.id)
    await app.services.table.remove(table.id)
  })

  it('drop the view if there is no more column in the table', async () => {
    expect.assertions(2)

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

    const numberOfSchemaBeforeColumnRemoveRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaBeforeColumnRemove = parseInt(numberOfSchemaBeforeColumnRemoveRaw.rows[0].count, 10)

    expect(numberOfSchemaBeforeColumnRemove).toBe(1)

    await app.services.column.remove(column.id)

    const numberOfSchemaAfterColumnRemoveRaw = await knexService.raw(`
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
      AND table_type = 'VIEW'
    `, ['workspace_test_table_sql_view', 'first_table'])
    const numberOfSchemaAfterColumnRemove = parseInt(numberOfSchemaAfterColumnRemoveRaw.rows[0].count, 10)

    expect(numberOfSchemaAfterColumnRemove).toBe(0)

    await app.services.table.remove(table.id)
  })
  afterAll(async () => {
    await dropWorkspace(app, workspaceTestTableSQLView.id)
  })
})
