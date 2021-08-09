import { Paginated } from '@feathersjs/feathers'
import app from '../../app'
import { Database } from '../../models/database.model'

describe('\'table\' service', () => {
  it('registered the service', () => {
    const service = app.service('table')
    expect(service).toBeTruthy()
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
    await app.services.table.remove(table.id)
    await app.services.database.remove(db.id)
    await app.services.aclset.remove(workspace.aclsets[0].id)
    await app.services.workspace.remove(workspace.id)
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
    const table = await app.services.table.create({
      text: 'myTable',
      database_id: db.id,
    })
    await expect(app.services.table.create({
      text: 'myTable',
      database_id: db.id,
    })).rejects.toThrow()
    await app.services.table.remove(table.id)
    await app.services.database.remove(db.id)
    await app.services.aclset.remove(workspace.aclsets[0].id)
    await app.services.workspace.remove(workspace.id)
  })
})
