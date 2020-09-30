// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { table as LckTable } from './table.model'

export interface RowData {
  [key: string]: string | { reference: string, value: string }
}

export class row extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  text!: string;
  data!: RowData;

  static get tableName() {
    return 'table_row';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['table_id', 'text'],

      properties: {
        text: { type: 'string' },
        data: { type: 'object'},
        table_id: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      table: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckTable,
        join: {
          from: 'table_row.table_id',
          to: 'table.id'
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
  return row;
}
