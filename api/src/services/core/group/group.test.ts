import { describe, it, assert } from 'vitest'
import { createApp } from '../../../app'

const app = createApp()

describe('group service', () => {
  it('registered the service', () => {
    const service = app.service('group')

    assert.ok(service, 'Registered the service')
  })

  it('returns all group users when queried with $joinRelated users')

  it('creates a new group if user is ADMIN')

  it('creates a new group in a workspace if the user is CREATOR')
})
