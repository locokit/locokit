// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { column as LckColumn } from './column.model'
import { row as LckRow } from './row.model'

export class LckColumnFilter {
  // $eq?: string
  // $neq?: string
  [key: string]: string | Array<string | number> | Object
}
export class LckColumnDTO extends LckColumn {
  filter?: LckColumnFilter
  sort?: Object
}

class view extends Model {
  createdAt!: string;
  updatedAt!: string;
  columns?: LckColumnDTO[]

  static get tableName() {
    return 'table_view';
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
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckColumn,
        join: {
          from: 'table_view.id',
          through: {
            from: 'table_view_has_table_column.table_view_id',
            to: 'table_view_has_table_column.table_column_id',
            extra: ['order', 'filter', 'visible', 'position']
          },
          to: 'table_column.id',
        }
      },
      rows: {
        relation: Model.HasManyRelation,
        modelClass: LckRow,
        join: {
          from: 'table_view.table_id',
          to: 'table_row.table_id'
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
  return view;
}
