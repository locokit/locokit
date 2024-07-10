import { resolve } from '@feathersjs/schema'
import type { HookContext } from '@/declarations'

import type { WorkflowRunData, WorkflowRunSchema, WorkflowRunQuery } from './workflow-run.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const workflowRunDataResolver = resolve<WorkflowRunData, HookContext>({
  async createdAt() {
    return new Date().toISOString()
  },
  async updatedAt() {
    return new Date().toISOString()
  },
})

// Resolver for the data that is being returned
export const workflowRunResultResolver = resolve<WorkflowRunSchema, HookContext>({})

// Resolver for query properties
export const workflowRunQueryResolver = resolve<WorkflowRunQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const workflowRunResolvers = {
  result: workflowRunResultResolver,
  data: {
    create: workflowRunDataResolver,
  },
  query: workflowRunQueryResolver,
}
