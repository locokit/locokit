import { API_PATH } from '@locokit/definitions'
import { createSwaggerServiceOptions } from 'feathers-swagger'
import { JSONSchema, Model, RelationMappings } from 'objection'
import type { Application } from '../../declarations'
import { ObjectionAdapterOptions } from '../../feathers-objection'
import { UserModel } from '../auth/user/user.service'
import { DatasourceModel } from './datasource/datasource.service'

import { WorkspaceService, workspaceHooks } from './workspace.class'
import {
  workspaceDataSchema,
  workspaceQuerySchema,
  workspaceSchema,
} from './workspace.schema'

export class WorkspaceModel extends Model {
  static readonly model = 'workspace'

  static readonly tableName = 'workspace'

  static get jsonSchema(): JSONSchema {
    return workspaceSchema.definition as unknown as JSONSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      datasources: {
        relation: Model.HasManyRelation,
        modelClass: DatasourceModel,
        join: {
          from: 'workspace.id',
          to: 'datasource.workspaceId',
        },
      },
      owner: {
        relation: Model.HasOneRelation,
        modelClass: UserModel,
        join: {
          from: 'workspace.createdBy',
          to: 'user.id',
        },
      },
    }
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export function workspaceService(app: Application): void {
  const options: ObjectionAdapterOptions = {
    paginate: app.get('paginate'),
    Model: WorkspaceModel,
    name: 'workspace',
    schema: 'core',
  }

  // Register our service on the Feathers application
  app.use(API_PATH.WORKSPACE.ROOT, new WorkspaceService(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { workspaceDataSchema, workspaceQuerySchema, workspaceSchema },
      docs: { description: 'Workspace service' },
    }),
  })
  // Initialize hooks
  app.service(API_PATH.WORKSPACE.ROOT).hooks(workspaceHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [API_PATH.WORKSPACE.ROOT]: WorkspaceService
  }
}
