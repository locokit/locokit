/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { TableColumn } from './tablecolumn.model'

export class TableColumnRelation extends BaseModel {
  table_column_from_id!: string;
  table_column_to_id!: string;
  from?:TableColumn;
  to?:TableColumn;

  static get idColumn () {
    return ['table_column_from_id', 'table_column_to_id']
  }

  static get tableName (): string {
    return 'table_column_relation'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: [
        'table_column_from_id',
        'table_column_to_id',
      ],

      properties: {
        table_column_from_id: { type: 'string' },
        table_column_to_id: { type: 'string' },
      },
    }
  }

  static get relationMappings () {
    return {
      from: {
        relation: Model.HasOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: TableColumn,
        join: {
          from: 'table_column_relation.table_column_from_id',
          to: 'table_column.id',
        },
      },
      to: {
        relation: Model.HasOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: TableColumn,
        join: {
          from: 'table_column_relation.table_column_to_id',
          to: 'table_column.id',
        },
      },
    }
  }

  $beforeInsert (): void {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate (): void {
    this.updatedAt = new Date().toISOString()
  }
}

export default function (app: Application): typeof TableColumnRelation {
  return TableColumnRelation
}
