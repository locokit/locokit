// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, Model, RelationMappings } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'
import { LckAclSet } from './aclset.model'
import { Table } from './table.model'

export class LckAclTable extends BaseModel {
  aclset_id!: string
  table_id!: string
  create_rows!: boolean
  read_rows!: boolean
  update_rows!: boolean
  delete_rows!: boolean
  read_filter!: object
  update_filter!: object
  delete_filter!: object

  static get tableName (): string {
    return 'acl_table'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['aclset_id', 'table_id'],

      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        aclset_id: {
          type: 'string',
          format: 'uuid',
        },
        table_id: {
          type: 'string',
          format: 'uuid',
        },
        create_rows: { type: 'boolean' },
        read_rows: { type: 'boolean' },
        update_rows: { type: 'boolean' },
        delete_rows: { type: 'boolean' },
        read_filter: { type: 'object' },
        update_filter: { type: 'object' },
        delete_filter: { type: 'object' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      aclset: {
        relation: Model.HasOneRelation,
        modelClass: LckAclSet,
        join: {
          from: 'acl_table.aclset_id',
          to: 'acl_set.id',
        },
      },
      table: {
        relation: Model.HasOneRelation,
        modelClass: Table,
        join: {
          from: 'acl_table.table_id',
          to: 'table.id',
        },
      },
    }
  }
}

export default function (app: Application): typeof LckAclTable {
  return LckAclTable
}
