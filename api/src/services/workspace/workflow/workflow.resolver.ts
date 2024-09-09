import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'
import { toSnakeCase } from '@/utils/toSnakeCase'

import type {
  WorkflowDataInternal,
  WorkflowPatchInternal,
  WorkflowResult,
  WorkflowQuery,
} from './workflow.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const workflowDataResolver = resolve<WorkflowDataInternal, HookContext>({
  async slug(slug, data) {
    if (slug) return slug
    return toSnakeCase(data.name)
  },
  async createdAt() {
    return new Date().toISOString()
  },
  async updatedAt() {
    return new Date().toISOString()
  },
})

// Resolver for making partial updates
export const workflowPatchResolver = resolve<WorkflowPatchInternal, HookContext>({
  async updatedAt() {
    return new Date().toISOString()
  },
})
// Resolver for the data that is being returned
export const workflowResultResolver = resolve<WorkflowResult, HookContext>({})

// Resolver for query properties
export const workflowQueryResolver = resolve<WorkflowQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const workflowResolvers = {
  result: workflowResultResolver,
  data: {
    create: workflowDataResolver,
    update: workflowDataResolver,
    patch: workflowPatchResolver,
  },
  query: workflowQueryResolver,
}
