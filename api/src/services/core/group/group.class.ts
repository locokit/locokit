import { KnexAdapterParams } from '@feathersjs/knex'
import { HookMap } from '@feathersjs/feathers'
import { ObjectionService } from '@/feathers-objection'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { Application } from '@/declarations'

import {
  GroupData,
  GroupResult,
  GroupQuery,
  groupDataValidator,
  groupQueryValidator,
  groupPatchValidator,
  groupUpdateValidator,
} from './group.schema'
import { groupResolvers } from './group.resolver'
import { authenticate } from '@feathersjs/authentication'

import { setAbilities } from './group.ability'
import { authorize, authorize } from 'feathers-casl'

const authorizeHook = authorize({ adapter: '@feathersjs/knex' })

export const groupHooks: HookMap<Application, GroupService> = {
  around: {
    all: [
      authenticate('jwt'),
      schemaHooks.resolveExternal(groupResolvers.dispatch),
      schemaHooks.resolveResult(groupResolvers.result),
    ],
  },
  before: {
    all: [setAbilities, authorizeHook],
    find: [
      schemaHooks.validateQuery(groupQueryValidator),
      schemaHooks.resolveQuery(groupResolvers.query),
    ],
    create: [
      schemaHooks.validateData(groupDataValidator),
      schemaHooks.resolveData(groupResolvers.data.create),
    ],
    patch: [
      schemaHooks.validateData(groupPatchValidator),
      schemaHooks.resolveData(...groupResolvers.data.patch),
    ],
    update: [
      schemaHooks.validateData(groupUpdateValidator),
      schemaHooks.resolveData(...groupResolvers.data.update),
    ],
    remove: [],
  },
  after: {},
  error: {},
}

export interface GroupParams extends KnexAdapterParams<GroupQuery> {}

// By default, calls the standard Knex adapter service methods but can be customized with your own functionality.
export class GroupService extends ObjectionService<GroupResult, GroupData, GroupParams> {}
