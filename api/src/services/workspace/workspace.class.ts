import { KnexAdapterParams } from '@feathersjs/knex'
import {
  resolveData,
  resolveQuery,
  resolveAll,
  validateQuery,
  validateData,
} from '@feathersjs/schema'

import {
  WorkspaceData,
  WorkspaceResult,
  WorkspaceQuery,
  workspaceDataValidator,
} from './workspace.schema'
import {
  workspaceQueryValidator,
  workspaceResolvers,
} from './workspace.resolver'
import { HookContext } from '../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '../../feathers-objection'
import { UserResult } from '../auth/user/user.schema'
import { PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'

export const workspaceHooks = {
  around: {
    all: [validateData(workspaceDataValidator), resolveAll(workspaceResolvers)],
  },
  before: {
    find: [
      authenticate('jwt', 'public'),
      validateQuery(workspaceQueryValidator),
      resolveQuery(workspaceResolvers.query),
    ],
    create: [
      authenticate('jwt'),
      resolveData(workspaceResolvers.data.create),
      async function checkProfile(context: HookContext) {
        const user: UserResult = context.params.user
        const profile = user.profile

        if (profile === PROFILE.MEMBER)
          throw new Forbidden(
            "You don't have sufficient privilege to create a workspace.",
          )
      },
    ],
  },
  after: {
    find: [resolveData(workspaceResolvers.result)],
  },
  error: {},
}

export interface WorkspaceParams extends KnexAdapterParams<WorkspaceQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspaceService extends ObjectionService<
  WorkspaceResult,
  WorkspaceData,
  WorkspaceParams
> {}
