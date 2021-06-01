import app from '../../app'

describe('\'table\' service', () => {
  it('registered the service', () => {
    const service = app.service('table')
    expect(service).toBeTruthy()
  })

  it('create a table on the right database', async () => {
    const workspace = await app.services.workspace.create({
      text: 'myWorkspace',
    })
    const db = await app.services.database.create({
      text: 'myDB',
      workspace_id: workspace.id,
    })
    const table = await app.services.table.create({
      text: 'myTable',
      database_id: db.id,
    })
    expect(table).toBeTruthy()
    expect(table.id).toBeDefined()
    await app.services.table.remove(table.id)
    await app.services.database.remove(db.id)
    await app.services.workspace.remove(workspace.aclsets[0].id)
    await app.services.workspace.remove(workspace.id)
  })

  it('throw an error if we create a table with a name already taken, on the same database', async () => {
    const workspace = await app.services.workspace.create({
      text: 'myWorkspace',
    })
    const db = await app.services.database.create({
      text: 'myDB',
      workspace_id: workspace.id,
    })
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
    await app.services.workspace.remove(workspace.aclsets[0].id)
    await app.services.workspace.remove(workspace.id)
  })
})
