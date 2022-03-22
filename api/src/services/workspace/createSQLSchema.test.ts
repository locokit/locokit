import Knex from 'knex'
import app from '../../app'
import { Workspace } from '../../models/workspace.model'
import { dropWorkspace } from '../../utils/dropWorkspace'

const workspaceService = app.services.workspace
const knexService = app.get('knex') as Knex

describe('createWorkspaceSQLSchema hook', () => {
  it('create a workspace without schema if not wished', async () => {
    expect.assertions(2)

    const numberOfSchemaRaw = await knexService.raw('SELECT count(*)  FROM information_schema.schemata')
    const numberOfSchema = parseInt(numberOfSchemaRaw.rows[0].count, 10)

    const newWorkspace = await workspaceService.create({
      text: 'my workspace',
    })
    const numberOfSchemaAfterCreationRaw = await knexService.raw('SELECT count(*)  FROM information_schema.schemata')
    const numberOfSchemaAfterCreation = parseInt(numberOfSchemaAfterCreationRaw.rows[0].count, 10)

    expect(newWorkspace).toBeDefined()
    expect(numberOfSchemaAfterCreation).toBe(numberOfSchema)

    await dropWorkspace(app, newWorkspace.id)
  })

  it('create a workspace with a schema if wished', async () => {
    expect.assertions(3)

    const numberOfSchemaRaw = await knexService.raw('SELECT count(*)  FROM information_schema.schemata')
    const numberOfSchema = parseInt(numberOfSchemaRaw.rows[0].count, 10)

    const newWorkspace = await workspaceService.create({
      text: 'my workspace',
      generate_sql: true,
      slug: 'my_workspace',
    })
    expect(newWorkspace).toBeDefined()
    const numberOfSchemaAfterCreationRaw = await knexService.raw('SELECT count(*)  FROM information_schema.schemata')
    const numberOfSchemaAfterCreation = parseInt(numberOfSchemaAfterCreationRaw.rows[0].count, 10)
    expect(numberOfSchemaAfterCreation).toBe(numberOfSchema + 1)

    const myWorkspaceSchemaRaw = await knexService.raw('SELECT count(*) FROM information_schema.schemata WHERE schema_name = ?;', ['my_workspace'])
    expect(parseInt(myWorkspaceSchemaRaw.rows[0].count, 10)).toBe(1)

    await dropWorkspace(app, newWorkspace.id)
  })

  it('crash if generate_sql is true but no slug is given', async () => {
    expect.assertions(1)

    await expect(workspaceService.create({
      text: 'my workspace',
      generate_sql: true,
    })).rejects.toThrow()
  })

  it('crash if generate_sql is true but slug is not in snake case', async () => {
    expect.assertions(1)

    await expect(workspaceService.create({
      text: 'my workspace',
      generate_sql: true,
      slug: 'Pouet',
    })).rejects.toThrow()
  })

  it('create a schema when patching the workspace with generate_sql is true and a slug in snake_case', async () => {
    expect.assertions(3)

    const numberOfSchemaRaw = await knexService.raw('SELECT count(*)  FROM information_schema.schemata')
    const numberOfSchema = parseInt(numberOfSchemaRaw.rows[0].count, 10)

    const newWorkspace = await workspaceService.create({
      text: 'my workspace',
    })
    expect(newWorkspace).toBeDefined()

    await workspaceService.patch(newWorkspace.id, {
      generate_sql: true,
      slug: 'my_workspace',
    })

    const numberOfSchemaAfterCreationRaw = await knexService.raw('SELECT count(*)  FROM information_schema.schemata')
    const numberOfSchemaAfterCreation = parseInt(numberOfSchemaAfterCreationRaw.rows[0].count, 10)
    expect(numberOfSchemaAfterCreation).toBe(numberOfSchema + 1)

    const myWorkspaceSchemaRaw = await knexService.raw('SELECT count(*) FROM information_schema.schemata WHERE schema_name = ?;', ['my_workspace'])
    expect(parseInt(myWorkspaceSchemaRaw.rows[0].count, 10)).toBe(1)

    await dropWorkspace(app, newWorkspace.id)
  })

  it('crash when a workspace with the same slug already exist', async () => {
    expect.assertions(1)
    const workspace = await workspaceService.create({
      text: 'my workspace',
      generate_sql: true,
      slug: 'my_workspace',
    })

    await expect(workspaceService.create({
      text: 'my workspace 1',
      generate_sql: true,
      slug: 'my_workspace',
    })).rejects.toThrow()

    await dropWorkspace(app, workspace.id)
  })

  it('create views in the new schema, as many as workspace contains table', async () => {
    expect.assertions(2)
    const workspace = await workspaceService.create({
      text: 'my workspace',
      generate_sql: true,
      slug: 'my_workspace',
    }) as Workspace

    const database = await app.services.database.get(workspace.databases?.[0].id as string, { query: { $eager: 'tables' } })
    const numberOfTables = database.tables?.length || 0
    const numberOfViewsRaw = await knexService.raw('SELECT count(*)  FROM information_schema.views WHERE table_schema = ?;', ['my_workspace'])
    const numberOfViews = parseInt(numberOfViewsRaw.rows[0].count, 10)
    expect(numberOfTables).toBe(numberOfViews)
    expect(numberOfTables).toBeGreaterThan(0)
    await dropWorkspace(app, workspace.id)
  })
})

describe('dropWorkspaceSQLSchema hook', () => {
  it('drop the schema when a workspace is patched with generate_sql is false', async () => {
    expect.assertions(2)
    // create a workspace with generate_sql + slug
    const workspace = await workspaceService.create({
      text: 'my workspace',
      generate_sql: true,
      slug: 'my_workspace',
    })

    const myWorkspaceSchemaRaw = await knexService.raw('SELECT count(*) FROM information_schema.schemata WHERE schema_name = ?;', ['my_workspace'])
    expect(parseInt(myWorkspaceSchemaRaw.rows[0].count, 10)).toBe(1)

    // patch the workspace with generate_sql to false
    await workspaceService.patch(workspace.id, {
      generate_sql: false,
    })

    // check that schema is no more here
    const myWorkspaceSchemaRawAfterPatch = await knexService.raw('SELECT count(*) FROM information_schema.schemata WHERE schema_name = ?;', ['my_workspace'])
    expect(parseInt(myWorkspaceSchemaRawAfterPatch.rows[0].count, 10)).toBe(0)

    await dropWorkspace(app, workspace.id)
  })

  it('drop the schema when a workspace is removed', async () => {
    expect.assertions(2)
    // create a workspace with generate_sql + slug
    const workspace = await workspaceService.create({
      text: 'my workspace',
      generate_sql: true,
      slug: 'my_workspace',
    })

    const myWorkspaceSchemaRaw = await knexService.raw('SELECT count(*) FROM information_schema.schemata WHERE schema_name = ?;', ['my_workspace'])
    expect(parseInt(myWorkspaceSchemaRaw.rows[0].count, 10)).toBe(1)

    await dropWorkspace(app, workspace.id)

    const myWorkspaceSchemaRawAfterPatch = await knexService.raw('SELECT count(*) FROM information_schema.schemata WHERE schema_name = ?;', ['my_workspace'])
    expect(parseInt(myWorkspaceSchemaRawAfterPatch.rows[0].count, 10)).toBe(0)
  })
})
