import { Ability } from '@casl/ability'
import { USER_PROFILE } from '@locokit/lck-glossary/src'
import { User } from '../models/user.model'
import { defineAbilityFor } from './app.abilities'

describe('App abilities', () => {
  let user: Partial<User>
  let ability: Ability

  describe('when user is a SUPERADMIN', () => {
    beforeEach(() => {
      user = { profile: USER_PROFILE.SUPERADMIN }
      ability = defineAbilityFor(user as User)
    })

    it('can do anything', () => {
      expect.assertions(2)
      expect(ability.can('manage', 'all')).toBe(true)
      expect(ability.can('create', 'workspace')).toBe(true)
    })
  })

  describe('when user is a ADMIN', () => {
    beforeEach(() => {
      user = { profile: USER_PROFILE.ADMIN }
      ability = defineAbilityFor(user as User)
    })

    it('cannot manage all', () => {
      expect(ability.can('manage', 'all')).toBe(false)
    })
    it('can read workspace', () => {
      expect(ability.can('read', 'workspace')).toBe(true)
    })
    it('can create workspace', () => {
      expect(ability.can('create', 'workspace')).toBe(true)
    })
  })
  describe('when user is a CREATOR', () => {
    beforeEach(() => {
      user = { profile: USER_PROFILE.CREATOR }
      ability = defineAbilityFor(user as User)
    })

    it('can not manage all', () => {
      expect(ability.can('manage', 'all')).toBe(false)
    })
    it('can read workspace', () => {
      expect(ability.can('read', 'workspace')).toBe(true)
    })
    it('can create workspace', () => {
      expect(ability.can('create', 'workspace')).toBe(true)
    })
  })
  describe('when user is a simple USER', () => {
    beforeEach(() => {
      user = { profile: USER_PROFILE.USER }
      ability = defineAbilityFor(user as User)
    })

    it('can not manage all', () => {
      expect(ability.can('manage', 'all')).toBe(false)
    })
    it('can read workspace', () => {
      expect(ability.can('read', 'workspace')).toBe(true)
    })
    it('cannot create workspace', () => {
      expect(ability.cannot('create', 'workspace')).toBe(true)
    })
  })
})
