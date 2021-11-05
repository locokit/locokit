import { Paginated } from '@feathersjs/feathers'
import app from '../../app'
import { Database } from '../../models/database.model'
import { Table } from '../../models/table.model'
import { dropWorkspace } from '../../utils/dropWorkspace'

describe('\'table\' service', () => {
  it('registered the service', () => {
    const service = app.service('table')
    expect(service).toBeTruthy()
  })

  it('paginate results by default to 10', async () => {
    expect.assertions(2)
    const tables = await app.service('table').find() as Paginated<Table>
    expect(tables.total).toBeDefined()
    expect(tables.limit).toBe(10)
  })

  it('allow to have non-paginated result', async () => {
    expect.assertions(1)
    const tables = await app.service('table').find({
      query: {
        $limit: -1,
      },
    }) as Table[]
    expect(tables instanceof Array).toBe(true)
  })

  it('create a table on the right database', async () => {
    const workspace = await app.services.workspace.create({
      text: 'myWorkspace',
    })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    const db = workspaceDatabases.data[0]
    const table = await app.services.table.create({
      text: 'myTable',
      database_id: db.id,
    })
    expect(table).toBeTruthy()
    expect(table.id).toBeDefined()
    await dropWorkspace(app, workspace.id)
  })

  it('throw an error if we create a table with a name already taken, on the same database', async () => {
    const workspace = await app.services.workspace.create({
      text: 'myWorkspace',
    })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace.id,
        $limit: 1,
      },
    }) as Paginated<Database>
    const db = workspaceDatabases.data[0]
    await app.services.table.create({
      text: 'myTable',
      database_id: db.id,
    })
    await expect(app.services.table.create({
      text: 'myTable',
      database_id: db.id,
    })).rejects.toThrow()
    await dropWorkspace(app, workspace.id)
  })
})
