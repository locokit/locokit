import { resolve } from '@feathersjs/schema'
import { getValidator } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import { queryValidator } from '../../schemas/validators'
import { toSnakeCase } from '../../utils/toSnakeCase'

import {
  // WorkspaceData,
  // WorkspacePatch,
  // WorkspaceResult,
  WorkspaceQuery,
  workspaceQuerySchema,
  WorkspaceSchema,
} from './workspace.schema'
// import {
//   workspaceDataSchema,
//   workspacePatchSchema,
//   workspaceResultSchema,
//   workspaceQuerySchema,
// } from './workspace.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceResolver = resolve<WorkspaceSchema, HookContext>({
  // schema: workspaceDataSchema.properties,
  // validate: 'before',
  // properties: {
  /**
   * Set the creator to the current user logged
   */
  createdBy: async (createdBy, _data, context) => {
    if (createdBy === null || createdBy === undefined) {
      return context.params.user.id
    }
  },
  /**
   * Compute a slug before insertion too
   */
  slug: async (slug, data) => {
    if (slug === null || slug === undefined) {
      return toSnakeCase(data.name)
    }
  },
  // },
})

// Resolver for query properties
export const workspaceQueryResolver = resolve<WorkspaceQuery, HookContext>({
  // $forCurrentUser: async (value, _data, context) => {
  //   if (value === true) {
  //     context.params.query = {
  //       ...context.params.query,
  //     }
  //   }
  //   return true
  // },
})
export const workspaceQueryValidator = getValidator(
  workspaceQuerySchema,
  queryValidator,
)

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspaceResolvers = {
  result: workspaceResolver,
  data: {
    create: workspaceResolver,
    update: workspaceResolver,
    patch: workspaceResolver,
  },
  query: workspaceQueryResolver,
}
