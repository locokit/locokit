import { describe, assert, it } from 'vitest'
import { createApp } from '../../../app'

const app = createApp()

describe('users service', () => {
  it('registered the service', () => {
    const service = app.service('user')

    assert.ok(service, 'Registered the service')
  })

  it('return groups of a user when using the $joinRelated option')

  it('allow admin users to filter on all users')
  it('allow admin users to filter on all users by username')
  it('allow users to get themselves')
  it('forbid users to get another user')
  it('allow users to find users and retrieve their username')
  it('allow users to find users and filter on their username')

  it('forbid the creation of a user from external calls')
  it('forbid the creation of a user from external calls for public users')
  it('forbid the creation of a user from external calls except admin users')

  it('forbid the patch without auth')
  it('forbid the patch of specific fields for a logged user')
  it('forbid the patch of specific fields for another user than the logged user')
  it('forbid the patch of specific fields for another user than the logged user')
  /** check also the patch fields admin vs not admin users */

  it('forbid the removal of a user')
  it('forbid the removal of a user except for admin users')

  it('trim the email when a user is created')
  it('lowercase the email when a user is created')
})
