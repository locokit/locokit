import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../../declarations'
import { toSnakeCase } from '../../utils/toSnakeCase'

import type {
  WorkspaceData,
  WorkspacePatch,
  WorkspaceResult,
  WorkspaceQuery,
} from './workspace.schema'
import {
  workspaceDataSchema,
  workspacePatchSchema,
  workspaceResultSchema,
  workspaceQuerySchema,
} from './workspace.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const workspaceDataResolver = resolve<WorkspaceData, HookContext>({
  schema: workspaceDataSchema,
  validate: 'before',
  properties: {
    /**
     * Set the creator to the current user logged
     */
    createdBy: async (createdBy, _data, context) => {
      console.log(context.params)
      if (createdBy === null || createdBy === undefined) {
        return context.params.user.id
      }
    },
    /**
     * Compute a slug before insertion too
     */
    slug: async (slug, data) => {
      console.log(slug, data)
      if (slug === null || slug === undefined) {
        console.log(toSnakeCase(data.name))
        return toSnakeCase(data.name)
      }
    },
  },
})

// Resolver for making partial updates
export const workspacePatchResolver = resolve<WorkspacePatch, HookContext>({
  schema: workspacePatchSchema,
  validate: 'before',
  properties: {},
})

// Resolver for the data that is being returned
export const workspaceResultResolver = resolve<WorkspaceResult, HookContext>({
  schema: workspaceResultSchema,
  validate: false,
  properties: {},
})

// Resolver for query properties
export const workspaceQueryResolver = resolve<WorkspaceQuery, HookContext>({
  schema: workspaceQuerySchema,
  validate: 'before',
  properties: {},
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const workspaceResolvers = {
  result: workspaceResultResolver,
  data: {
    create: workspaceDataResolver,
    update: workspaceDataResolver,
    patch: workspacePatchResolver,
  },
  query: workspaceQueryResolver,
}
