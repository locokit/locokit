import assert from 'assert'
import { app } from '../../../app'

describe('users service', () => {
  it('registered the service', () => {
    const service = app.service('users')

    assert.ok(service, 'Registered the service')
  })

  it('return groups of a user when using the $joinRelated option')
})