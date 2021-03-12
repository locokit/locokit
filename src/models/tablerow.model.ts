// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { Table as LckTable } from './table.model'
import { Model } from 'objection'

export interface RowData {
  [key: string]: string | { reference: string, value: string }
}

export class TableRow extends BaseModel {
  text!: string;
  data!: RowData;
  // eslint-disable-next-line camelcase
  table_id!: string;

  static get tableName () {
    return 'table_row'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['table_id'],

      properties: {
        text: { type: 'string' },
        data: { type: 'object' },
        table_id: { type: 'string' },
      },
    }
  }

  static get relationMappings () {
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
          to: 'table.id',
        },
      },
    }
  }
}

export default function (app: Application) {
  return TableRow
}
