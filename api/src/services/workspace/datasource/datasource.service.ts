import { API_PATH } from '@locokit/definitions'
import { JSONSchema, Model, RelationMappings } from 'objection'
import type { Application } from '../../../declarations'
import { createSwaggerServiceOptions } from 'feathers-swagger'

import { Datasource, datasourceHooks } from './datasource.class'
import { datasourceDataSchema, datasourceQuerySchema, datasourceSchema } from './datasource.schema'

export class DatasourceModel extends Model {
  static readonly model = 'datasource'

  static readonly tableName = 'lck_datasource'

  static get jsonSchema(): JSONSchema {
    return datasourceDataSchema.definition as unknown as JSONSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      workspace: {
        relation: Model.HasOneRelation,
        modelClass: DatasourceModel,
        join: {
          from: 'datasource.workspaceId',
          to: 'workspace.id',
        },
      },
    }
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export function datasourceService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: DatasourceModel,
    name: 'lck_datasource',
    // Service options will go here
  }

  // Register our service on the Feathers application
  app.use(API_PATH.WORKSPACE.DATASOURCE.ROOT, new Datasource(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: {
        datasourceDataSchema,
        datasourceQuerySchema,
        datasourceSchema,
      },
      docs: {
        tag: 'workspace > datasource',
      },
    }),
  })
  // Initialize hooks
  app.service(API_PATH.WORKSPACE.DATASOURCE.ROOT).hooks(datasourceHooks)
}

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [API_PATH.WORKSPACE.DATASOURCE.ROOT]: Datasource
  }
}
