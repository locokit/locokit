import app from '../../app'

describe('\'workspace\' service', () => {
  it('registered the service', () => {
    const service = app.service('workspace')
    expect(service).toBeTruthy()
  })

  it('can create a workspace', async () => {
    const service = app.service('workspace')
    const newWorkspace = await service.create({
      text: 'testWorkspace',
    })
    expect(newWorkspace).toBeTruthy()
  })

  // it('return workspace on which user have access', async () => {
  //   expect.assertions(2)
  // })

  // it('return all workspaces if user is SUPERADMIN', async () => {
  //   expect.assertions(1)
  // })
})
