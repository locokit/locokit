import { SERVICES } from '@locokit/definitions'
import { describe, it, assert } from 'vitest'
import { createApp } from '../../../app'

describe('[core] user-group service', () => {
  const app = createApp()
  it('registered the service', () => {
    const service = app.service(SERVICES.CORE_USERGROUP)

    assert.ok(service, 'Registered the service')
  })

  it.todo('returns all group users when queried with $joinRelated users')

  it.todo('creates a new group if user is ADMIN')

  it.todo('creates a new group in a workspace if the user is CREATOR')
})
