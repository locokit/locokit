/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Application } from '../declarations'
import { User } from './user.model'
import { Model, RelationMappings, JSONSchema } from 'objection'
import { RowData, TableRow } from './tablerow.model'
import { TableColumn } from './tablecolumn.model'
import { BaseModel } from './base.model'

export enum LOG_EVENT {
  RECORD_CREATE = 'RECORD_CREATE',
  RECORD_PATCH = 'RECORD_PATCH',
  RECORD_REMOVE = 'RECORD_REMOVE',
  RECORD_UPDATE = 'RECORD_UPDATE',
}

export class Log extends BaseModel {
  deleted_user?: string
  event!: LOG_EVENT
  field?: TableColumn
  field_id?: string
  from?: RowData
  to?: RowData
  record?: TableRow
  record_id?: string
  user?: User
  user_id?: number

  static modelName: 'log'

  static get tableName (): string {
    return 'log'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: [
        'event',
      ],

      properties: {
        deleted_user: { type: 'string' },
        event: { type: 'string' },
        field_id: { type: 'string' },
        from: { type: 'object' },
        to: { type: 'object' },
        record_id: { type: 'string' },
        user_id: { type: 'number' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'log.user_id',
          to: 'user.id',
        },
      },
      record: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableRow,
        join: {
          from: 'log.record_id',
          to: 'table_row.id',
        },
      },
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableColumn,
        join: {
          from: 'log.field_id',
          to: 'table_column.id',
        },
      },

    }
  }
}

export default function (app: Application): typeof Log {
  return Log
}
