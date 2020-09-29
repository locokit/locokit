// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { row as LckRow } from './row.model'
import { view as LckView } from './view.model'
import { column as LckColumn } from './column.model'
import { LckColumnDTO } from './view.model';
import { QueryBuilder } from 'objection';

export class table extends Model {
  createdAt!: string;
  updatedAt!: string;
  columns?: LckColumnDTO[]

  static get tableName() {
    return 'table';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      columns: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckColumn,
        join: {
          from: 'table.id',
          to: 'table_column.table_id'
        },
        modify(query: QueryBuilder<LckColumn>) {
          query.clear('limit')
        }
      },
      rows: {
        relation: Model.HasManyRelation,
        modelClass: LckRow,
        join: {
          from: 'table.id',
          to: 'table_row.table_id'
        }
      },
      views: {
        relation: Model.HasManyRelation,
        modelClass: LckView,
        join: {
          from: 'table.id',
          to: 'table_view.table_id'
        }
      }
    }
  }
  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default function (app: Application) {

  return table;
}
