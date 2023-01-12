import assert from 'assert'
import { createApp } from '../../app'

describe('workspace service', () => {
  const app = createApp()
  it('registered the service', () => {
    const service = app.service('workspace')

    assert.ok(service, 'Registered the service')
  })

  it('returns the public workspace when making a find request without authentication', () => {})

  it("can't create a workspace for unauthenticated users", () => {})
  it("can't patch a workspace for unauthenticated users", () => {})
  it("can't update a workspace for unauthenticated users", () => {})
  it("can't remove a workspace for unauthenticated users", () => {})

  it('create a dedicated schema for new workspaces', () => {
    /**
     * with all necessary stuff :
     * * user
     * * group
     * * workspace (only one)
     * * role (public, admin and members)
     * * datasource (empty)
     * * media ?
     */
  })

  it('returns only workspace of a user when using the $forCurrentUser option', () => {})

  it('returns all workspaces of the current logged user AND public workspaces when not using the $forCurrentUser option', () => {})
})
