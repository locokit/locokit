// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { column as LckColumn } from './column.model'

class view extends Model {
  createdAt!: string;
  updatedAt!: string;

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
            to: 'table_view_has_table_column.table_column_id'
          },
          to: 'table_column.id',
        }
      },
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
