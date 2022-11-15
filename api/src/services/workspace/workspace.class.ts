// import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { resolveData } from '@feathersjs/schema'

import type {
  WorkspaceData,
  WorkspaceResult,
  WorkspaceQuery,
} from './workspace.schema'
import { workspaceResolvers } from './workspace.resolver'
import { HookContext } from '../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '../../feathers-objection'

export const workspaceHooks = {
  around: {
    // all: [resolveAll(workspaceResolvers)],
  },
  before: {
    create: [
      authenticate('jwt'),

      resolveData(workspaceResolvers.data.create),
      (context: HookContext) => {
        console.log(context.params)
        console.log(context.params.rules)
        console.log(context.ability)
        console.log(context.params.ability)
      },
    ],
  },
  after: {},
  error: {},
}

export interface WorkspaceParams extends KnexAdapterParams<WorkspaceQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class Workspace extends ObjectionService<
  WorkspaceResult,
  WorkspaceData,
  WorkspaceParams
> {}
