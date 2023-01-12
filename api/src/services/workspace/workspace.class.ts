import type { KnexAdapterParams } from '@feathersjs/knex'
import {
  resolveData,
  resolveAll,
  resolveQuery,
  validateQuery,
} from '@feathersjs/schema'

import type {
  WorkspaceData,
  WorkspaceResult,
  WorkspaceQuery,
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
    all: [resolveAll(workspaceResolvers)],
  },
  before: {
    find: [
      validateQuery(workspaceQueryValidator),
      resolveQuery(workspaceResolvers.query),
    ],
    create: [
      authenticate('jwt'),
      resolveData(workspaceResolvers.data.create),
      function checkProfile(context: HookContext) {
        const user: UserResult = context.params.user
        const profile = user.profile

        if (profile === PROFILE.MEMBER)
          throw new Forbidden(
            "You don't have sufficient privilege to create a workspace.",
          )
      },
    ],
  },
  after: {},
  error: {},
}

export interface WorkspaceParams extends KnexAdapterParams<WorkspaceQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspaceService extends ObjectionService<
  WorkspaceResult,
  WorkspaceData,
  WorkspaceParams
> {}
// async function checkSlug(slugToCheck: string) {
//   // this.
//   // SELECT count(*) from workspace where slug = slugToCheck
//   // return {
//   //   code: LCK_ERROR.SLUG_ALREADY_TAKEN,
//   //   message: 'Slug is already taken. Please change your workspace name.'
//   // }
// }
