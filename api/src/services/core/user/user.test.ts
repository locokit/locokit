import { SERVICES } from '@locokit/definitions'
import { describe, assert, it, afterAll, beforeAll } from 'vitest'
import { createApp } from '../../../app'

describe('users service', () => {
  const app = createApp()
  const port = app.get('port') || 8998

  beforeAll(async () => {
    await app.listen(port)
  })
  it('registered the service', () => {
    const service = app.service(SERVICES.CORE_USER)

    assert.ok(service, 'Registered the service')
  })

  it.todo('return groups of a user when using the $joinRelated option')

  it.todo('allow admin users to filter on all users')
  it.todo('allow admin users to filter on all users by username')
  it.todo('allow users to get themselves')
  it.todo('forbid users to get another user')
  it.todo('allow users to find users and retrieve their username')
  it.todo('allow users to find users and filter on their username')

  it.todo('forbid the creation of a user from external calls')
  it.todo('forbid the creation of a user from external calls for public users')
  it.todo('forbid the creation of a user from external calls except admin users')

  it.todo('forbid the patch without auth')
  it.todo('forbid the patch of specific fields for a logged user') // isVerified, ...
  it.todo('forbid the patch of specific fields for another user than the logged user')
  it.todo('forbid the patch of specific fields for admin user') // createdAt, lastConnection, ...
  it.todo('allow the patch of specific fields for admin user')
  /** check also the patch fields admin vs not admin users */

  it.todo('forbid the removal of a user')
  it.todo('forbid the removal of a user except for admin users')

  it.todo('trim the email when a user is created')
  it.todo('lowercase the email when a user is created')

  it.todo('forbid to filter on verifyToken through an external call without being admin')
  it.todo('forbid to filter on another field through an external call without being admin')
  it.todo('forbid to filter through this endpoint if external call without being admin')

  it.todo('forbid the filtering of users from this endpoint without being an admin user')
  afterAll(async () => {
    await app.teardown()
  })
})
