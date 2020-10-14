/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection'
import { Application } from '../declarations'
import { table as LckTable } from './table.model'
import { columnType as LckColumnType } from './columnType.model'

export interface SingleSelectValue {
  label: string;
  color: string;
  backgroundColor: string;
}

export class TableColumn extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  text!: string;
  reference!: boolean;
  reference_position!: number;
  settings!: {
    formula?: string,
    query?: {
      select: string[],
      where: Object,
      sort: { field: string, order: string}[],
      limit: number,
      skip: number,
      aggregate: string // count, avg, sum, min, max, count distinct
    },
    table_to_id?: string,
    column_to_id?: string,
    column_from_id?: string,
    tableId?: string,
    localField?: string,
    foreignField?: string,
    values?: Record<string, SingleSelectValue>,
    width?: number
  };

  position!: number;
  table_id!: string;
  column_type_id!: number;

  static get tableName () {
    return 'table_column'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
        settings: { type: 'object' },
        table_id: { type: 'string' },
        column_type_id: { type: 'number' },
        position: { type: 'number' }
      }
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
          from: 'table_column.table_id',
          to: 'table.id'
        }
      },
      type: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckColumnType,
        join: {
          from: 'table_column.column_type_id',
          to: 'column_type.id'
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
  return TableColumn
}
