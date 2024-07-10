import type { KnexAdapterParams } from '@feathersjs/knex'
import {
  WorkflowResult,
  WorkflowQuery,
  WorkflowPatch,
  WorkflowDataExternal,
} from './workflow.schema'
import { ObjectionService } from '@/feathers-objection'

export interface WorkflowParams extends KnexAdapterParams<WorkflowQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class Workflow extends ObjectionService<
  WorkflowResult,
  WorkflowDataExternal,
  WorkflowParams,
  WorkflowPatch
> {}
