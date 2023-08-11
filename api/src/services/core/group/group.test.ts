import { SERVICES } from '@locokit/definitions'
import { describe, it, assert } from 'vitest'
import { createApp } from '../../../app'

describe('[core] group service', () => {
  const app = createApp()
  it('registered the service', () => {
    const service = app.service(SERVICES.CORE_GROUP)

    assert.ok(service, 'Registered the service')
  })

  it.todo('returns all group users when queried with $joinRelated users')

  it.todo('creates a new group if user is ADMIN')

  it.todo('creates a new group in a workspace if the user is CREATOR')

  it.todo('remove all sensitive data of users when retrieving users relation')

  it.todo('filter on workspace name')
  it.todo('filter on workspace owner username')

  it.todo('filter on workspace name AND group name ($joinEager with objection + validation)')
})
