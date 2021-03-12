/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Model, JSONSchema } from 'objection'
import { Application } from '../declarations'
import { TableRow } from './tablerow.model'

export class TableRowRelation extends BaseModel {
  table_row_from_id!: string;
  table_row_to_id!: string;
  table_column_to_id!: string;
  from?: TableRow;
  to?: TableRow;

  static get idColumn () {
    return ['table_row_to_id', 'table_column_to_id']
  }

  static get tableName (): string {
    return 'table_row_relation'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: [
        'table_row_from_id',
        'table_row_to_id',
        'table_column_to_id'
      ],

      properties: {
        table_row_from_id: { type: 'string' },
        table_row_to_id: { type: 'string' },
        table_column_to_id: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
    return {
      from: {
        relation: Model.HasOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one.
        modelClass: TableRow,
        join: {
          from: 'table_row_relation.table_row_from_id',
          to: 'table_row.id'
        }
      },
      to: {
        relation: Model.HasOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one.
        modelClass: TableRow,
        join: {
          from: 'table_row_relation.table_row_to_id',
          to: 'table_row.id'
        }
      }
    }
  }

  $beforeInsert (): void {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate (): void {
    this.updatedAt = new Date().toISOString()
  }
}

export default function (app: Application): typeof TableRowRelation {
  return TableRowRelation
}
