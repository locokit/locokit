// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, QueryBuilder } from 'objection'
import { Application } from '../declarations'
import { TableRow } from './tablerow.model'
import { TableView, TableColumnDTO } from './tableview.model'
import { TableColumn } from './tablecolumn.model'

export class table extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  columns?: TableColumnDTO[]

  static get tableName () {
    return 'table'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
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
          to: 'table_column.table_id'
        },
        modify (query: QueryBuilder<TableColumn>) {
          query.clear('limit')
        }
      },
      rows: {
        relation: Model.HasManyRelation,
        modelClass: TableRow,
        join: {
          from: 'table.id',
          to: 'table_row.table_id'
        }
      },
      views: {
        relation: Model.HasManyRelation,
        modelClass: TableView,
        join: {
          from: 'table.id',
          to: 'table_view.table_id'
        }
      }
    }
  }

  $beforeInsert () {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }
}

export default function (app: Application) {
  return table
}
