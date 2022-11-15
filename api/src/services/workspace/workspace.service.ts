import { API_PATH } from '@locokit/definitions'
import { JSONSchema, Model, RelationMappings } from 'objection'
import type { Application } from '../../declarations'
import { DatasourceModel } from './datasource/datasource.service'

import { Workspace, workspaceHooks } from './workspace.class'
import { workspaceDataSchema } from './workspace.schema'

class WorkspaceModel extends Model {
  static readonly model = 'workspace'

  static readonly tableName = 'workspace'

  static get jsonSchema(): JSONSchema {
    return workspaceDataSchema.definition as unknown as JSONSchema
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
    }
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export function workspaceService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: WorkspaceModel,
    name: 'workspace',
    // Service options will go here
  }

  // Register our service on the Feathers application
  app.use(API_PATH.WORKSPACE.ROOT, new Workspace(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service(API_PATH.WORKSPACE.ROOT).hooks(workspaceHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [API_PATH.WORKSPACE.ROOT]: Workspace
  }
}
