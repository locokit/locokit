// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, QueryBuilder, RelationMappings, JSONSchema } from 'objection'
import { Application } from '../declarations'
import { TableRow } from './tablerow.model'
import { TableView } from './tableview.model'
import { TableColumn, TableColumnDTO } from './tablecolumn.model'
import { Process } from './process.model'
import { BaseModel } from './base.model'
import { Database } from './database.model'

export class Table extends BaseModel {
  columns?: TableColumnDTO[]
  documentation?: string

  static get tableName (): string {
    return 'table'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      columns: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: TableColumn,
        join: {
          from: 'table.id',
          to: 'table_column.table_id',
        },
        modify (query: QueryBuilder<TableColumn>) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          query.clear('limit')
        },
      },
      rows: {
        relation: Model.HasManyRelation,
        modelClass: TableRow,
        join: {
          from: 'table.id',
          to: 'table_row.table_id',
        },
      },
      views: {
        relation: Model.HasManyRelation,
        modelClass: TableView,
        join: {
          from: 'table.id',
          to: 'table_view.table_id',
        },
      },
      processes: {
        relation: Model.HasManyRelation,
        modelClass: Process,
        join: {
          from: 'table.id',
          to: 'process.table_id',
        },
      },
      database: {
        relation: Model.HasOneRelation,
        modelClass: Database,
        join: {
          from: 'table.database_id',
          to: 'database.id',
        },
      },
    }
  }
}

export default function (app: Application): typeof Table {
  return Table
}
