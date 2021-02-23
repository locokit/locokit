/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { table as LckTable } from './table.model'
import { ColumnType as LckColumnType } from './columnType.model'

export interface SelectValue {
  label: string;
  color: string;
  backgroundColor: string;
}

export class TableColumn extends BaseModel {
  text!: string;
  reference!: boolean;
  reference_position!: number;
  locked!: boolean;
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
    values?: Record<string, SelectValue>,
    width?: number,
    required?: boolean,
    default?: string
  };

  position!: number;
  table_id!: string;
  table?: LckTable;
  column_type_id!: number;
  column_type?: LckColumnType;

  static get tableName () {
    return 'table_column'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
        reference: { type: 'boolean' },
        reference_position: { type: 'number' },
        locked: { type: 'boolean' },
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
      column_type: {
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
}

export default function (app: Application) {
  return TableColumn
}
