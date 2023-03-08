import { KnexAdapterParams } from '@feathersjs/knex'
import { WorkspaceData, WorkspaceResult, WorkspaceQuery } from './core-workspace.schema'
import { ObjectionService } from '@/feathers-objection'

export interface WorkspaceParams extends KnexAdapterParams<WorkspaceQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WorkspaceService extends ObjectionService<
  WorkspaceResult,
  WorkspaceData,
  WorkspaceParams
> {}
