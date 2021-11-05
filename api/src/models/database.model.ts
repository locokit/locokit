// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { Table as LckTable } from './table.model'
import { Model, RelationMappings, JSONSchema } from 'objection'
import { Workspace } from './workspace.model'

export class Database extends BaseModel {
  text!: string
  documentation?: string
  workspace_id!: string
  workspace?: Workspace
  tables?: LckTable[]

  static get tableName (): string {
    return 'database'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
        workspace_id: { type: 'string', format: 'uuid' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      tables: {
        relation: Model.HasManyRelation,
        modelClass: LckTable,
        join: {
          from: 'database.id',
          to: 'table.database_id',
        },
      },
      workspace: {
        relation: Model.HasOneRelation,
        modelClass: Workspace,
        join: {
          from: 'database.workspace_id',
          to: 'workspace.id',
        },
      },
    }
  }
}

export default function (app: Application): typeof Database {
  return Database
}
