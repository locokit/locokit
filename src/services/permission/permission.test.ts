import app from '../../app'

describe('\'permission\' service', () => {
  beforeAll(async () => {
    /**
     * Create a new attachment on a workspace
     */
  })

  it('registered the service', () => {
    const service = app.service('permission')
    expect(service).toBeTruthy()
  })

  it('throw an error if user is not authenticated', () => {

  })
  it('throw an error if user doesnt have access to the workspace', () => {

  })
  it('throw an error if url is misformed', () => {

  })
  it('throw an error if user have access to workspace but file doesnt exist', () => {

  })
  it('let the user pass if he is a member of a workspace group, and the file exist', () => {

  })
})
