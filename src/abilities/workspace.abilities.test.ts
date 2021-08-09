import { Ability } from '@casl/ability'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { Workspace } from '../models/workspace.model'
import { defineAbilityFor } from './workspace.abilities'
import app from '../app'
import { LckAclSet } from '../models/aclset.model'
import { Group } from '../models/group.model'
import { User } from '../models/user.model'

describe('Workspace abilities', () => {
  let user
  let ability: Ability

  /**
   * Create all necessary resources for testing use case
   * * several workspaces
   * * several aclset
   * * several groups
   * * several users
   */
  let workspace1: Workspace
  let workspace2: Workspace
  let aclset1: LckAclSet
  let aclset2: LckAclSet
  let aclset3: LckAclSet
  let aclset4: LckAclSet
  let group1: Group
  let group2: Group
  let group3: Group
  let group4: Group
  let user1: User
  let user2: User
  let user3: User
  beforeAll(async () => {
    workspace1 = await app.services.workspace.create({
      text: '[workspace-abilities] Workspace 1',
    })
    workspace2 = await app.services.workspace.create({
      text: '[workspace-abilities] Workspace 1',
    })
    aclset1 = await app.services.aclset.create({
      label: '[workspace-abilities] Acl Set 1',
      workspace_id: workspace1.id,
      manager: true,
    })
    aclset2 = await app.services.aclset.create({
      label: '[workspace-abilities] Acl Set 2',
      workspace_id: workspace1.id,
    })
    aclset3 = await app.services.aclset.create({
      label: '[workspace-abilities] Acl Set 3',
      workspace_id: workspace2.id,
      manager: true,
    })
    aclset4 = await app.services.aclset.create({
      label: '[workspace-abilities] Acl Set 4',
      workspace_id: workspace2.id,
    })
    user1 = await app.services.user.create({
      name: 'User 1',
      email: 'ws-abilities-user1@locokit.io',
      password: 'locokit',
      profile: USER_PROFILE.CREATOR,
    })
    user2 = await app.services.user.create({
      name: 'User 2',
      email: 'ws-abilities-user2@locokit.io',
      password: 'locokit',
    })
    user3 = await app.services.user.create({
      name: 'User 3',
      email: 'ws-abilities-user3@locokit.io',
      password: 'locokit',
    })
    group1 = await app.services.group.create({
      name: '[workspace-abilities] Group 1',
      aclset_id: aclset1.id,
      users: [user1, user3],
    })
    group2 = await app.services.group.create({
      name: '[workspace-abilities] Group 2',
      aclset_id: aclset2.id,
      users: [user2, user3],
    })
    group3 = await app.services.group.create({
      name: '[workspace-abilities] Group 3',
      aclset_id: aclset3.id,
      users: [user2],
    })
    group4 = await app.services.group.create({
      name: '[workspace-abilities] Group 4',
      aclset_id: aclset4.id,
      users: [user1],
    })
  })

  describe('when user is a SUPERADMIN', () => {
    beforeEach(async () => {
      user = { profile: USER_PROFILE.SUPERADMIN }
      ability = await defineAbilityFor(user as User, app.services)
    })

    it('can manage all workspaces', () => {
      expect.assertions(3)
      expect(ability.can('manage', 'workspace')).toBe(true)
      expect(ability.can('manage', workspace1)).toBe(true)
      expect(ability.can('manage', workspace2)).toBe(true)
    })
  })

  describe('when user is an ADMIN', () => {
    beforeEach(async () => {
      user = { profile: USER_PROFILE.ADMIN }
      ability = await defineAbilityFor(user as User, app.services)
    })

    it('can manage all workspaces - but not all resources', () => {
      expect.assertions(3)
      expect(ability.can('manage', 'workspace')).toBe(true)
      expect(ability.can('manage', workspace1)).toBe(true)
      expect(ability.can('manage', workspace2)).toBe(true)
    })
  })

  describe('when user (user1) is a CREATOR', () => {
    beforeEach(async () => {
      ability = await defineAbilityFor(user1, app.services)
    })

    it('can manage workspace (not all, but at least one)', () => {
      expect(ability.can('manage', 'workspace')).toBe(true)
    })
    it('can read workspace', () => {
      expect(ability.can('read', 'workspace')).toBe(true)
    })
    it('can create workspace', () => {
      expect(ability.can('create', 'workspace')).toBe(true)
    })
    it('can read workspace2 & workspace1', () => {
      expect.assertions(2)
      expect(ability.can('read', workspace1)).toBe(true)
      expect(ability.can('read', workspace2)).toBe(true)
    })
    it('can manage workspace1 but not workspace2', () => {
      expect.assertions(2)
      expect(ability.can('manage', workspace1)).toBe(true)
      expect(ability.cannot('manage', workspace2)).toBe(true)
    })
  })

  describe('when user (user2) is a simple USER with 2 groups for 2 workspaces', () => {
    beforeEach(async () => {
      ability = await defineAbilityFor(user2, app.services)
    })

    it('can not manage a single workspace (USER)', () => {
      expect(ability.cannot('manage', 'workspace')).toBe(true)
    })
    it('can read workspace', () => {
      expect(ability.can('read', 'workspace')).toBe(true)
    })
    it('cannot create workspace', () => {
      expect(ability.cannot('create', 'workspace')).toBe(true)
    })
    it('can read workspace2 & workspace1', () => {
      expect.assertions(2)
      expect(ability.can('read', workspace1)).toBe(true)
      expect(ability.can('read', workspace2)).toBe(true)
    })
    it('cannot manage workspace2 neither workspace1 because it is a USER', () => {
      expect.assertions(2)
      expect(ability.cannot('manage', workspace2)).toBe(true)
      expect(ability.cannot('manage', workspace1)).toBe(true)
    })
  })
  describe('when user (user3) is a simple USER with 2 groups for the same workspace', () => {
    beforeEach(async () => {
      ability = await defineAbilityFor(user3, app.services)
    })

    it('can not manage a single workspace (USER)', () => {
      expect(ability.cannot('manage', 'all')).toBe(true)
    })
    it('can read workspace', () => {
      expect(ability.can('read', 'workspace')).toBe(true)
    })
    it('cannot create workspace', () => {
      expect(ability.cannot('create', 'workspace')).toBe(true)
    })
    it('can read workspace1 but not workspace2', () => {
      expect.assertions(2)
      expect(ability.can('read', workspace1)).toBe(true)
      expect(ability.cannot('read', workspace2)).toBe(true)
    })
    it('cannot manage workspace1 neither workspace2 because it is a USER', () => {
      expect.assertions(2)
      expect(ability.cannot('manage', workspace1)).toBe(true)
      expect(ability.cannot('manage', workspace2)).toBe(true)
    })
  })

  afterAll(async () => {
    await app.services.usergroup.remove(`${user1.id},${group1.id}`)
    await app.services.usergroup.remove(`${user3.id},${group1.id}`)
    await app.services.usergroup.remove(`${user2.id},${group2.id}`)
    await app.services.usergroup.remove(`${user3.id},${group2.id}`)
    await app.services.usergroup.remove(`${user2.id},${group3.id}`)
    await app.services.usergroup.remove(`${user1.id},${group4.id}`)

    await app.services.user.remove(user3.id)
    await app.services.user.remove(user2.id)
    await app.services.user.remove(user1.id)
    await app.services.group.remove(group4.id)
    await app.services.group.remove(group3.id)
    await app.services.group.remove(group2.id)
    await app.services.group.remove(group1.id)
    await app.services.aclset.remove(aclset4.id)
    await app.services.aclset.remove(aclset3.id)
    await app.services.aclset.remove(aclset2.id)
    await app.services.aclset.remove(aclset1.id)
    await app.services.workspace.remove(workspace1.id)
    await app.services.workspace.remove(workspace2.id)
  })
})
