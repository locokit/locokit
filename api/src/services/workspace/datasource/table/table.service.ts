import { API_PATH } from '@locokit/definitions'
import { JSONSchema, Model, RelationMappings } from 'objection'
import type { Application } from '../../../../declarations'
import { DatasourceModel } from '../datasource.service'

import { Table, tableHooks } from './table.class'
import { tableDataSchema } from './table.schema'

export class TableModel extends Model {
  static readonly model = 'table'

  static readonly tableName = 'table'

  static get jsonSchema(): JSONSchema {
    return tableDataSchema.definition as unknown as JSONSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      datasource: {
        relation: Model.HasOneRelation,
        modelClass: DatasourceModel,
        join: {
          from: 'table.datasourceId',
          to: 'datasource.id',
        },
      },
    }
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export function tableService(app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    Model: TableModel,
    name: 'table',
    // Service options will go here
  }

  // Register our service on the Feathers application
  app.use(API_PATH.WORKSPACE.DATASOURCE.TABLE.ROOT, new Table(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service(API_PATH.WORKSPACE.DATASOURCE.TABLE.ROOT).hooks(tableHooks)
}

// Add this service to the service type index
declare module '../../../../declarations' {
  interface ServiceTypes {
    [API_PATH.WORKSPACE.DATASOURCE.TABLE.ROOT]: Table
  }
}
