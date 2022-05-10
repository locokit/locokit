/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection'
import { Application } from '../declarations'
import { ProcessRun } from './process_run.model'
import { BaseModel } from './base.model'
import { Table } from './table.model'
import { Workspace } from './workspace.model'

export enum ProcessTrigger {
  CREATE_ROW ='CREATE_ROW', // when a row in inserted
  UPDATE_ROW ='UPDATE_ROW', // when a row is updated, no matter which data
  UPDATE_ROW_DATA ='UPDATE_ROW_DATA', // when a data in a row is updated
  MANUAL ='MANUAL',
}

export class Process extends BaseModel {
  text?: string
  trigger!: ProcessTrigger
  settings?: {
    column_id: string
  }

  enabled!: boolean
  maximumNumberSuccess?: number
  url!: string
  table_id?: string
  workspace_id!: string

  static get tableName (): string {
    return 'process'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: [
        'workspace_id',
        'url',
        'trigger',
      ],

      properties: {
        id: { type: 'string' },
        text: { type: 'string' },
        enabled: { type: 'boolean' },
        maximumNumberSuccess: { type: 'number' },
        url: { type: 'string' },
        trigger: { type: 'string' },
        settings: { type: ['object', 'null'] },
        table_id: { type: ['string', 'null'] },
        workspace_id: { type: 'string' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      runs: {
        relation: Model.HasManyRelation,
        modelClass: ProcessRun,
        join: {
          from: 'process.id',
          to: 'process_run.process_id',
        },
      },
      table: {
        relation: Model.HasOneRelation,
        modelClass: Table,
        join: {
          from: 'process.table_id',
          to: 'table.id',
        },
      },
      workspace: {
        relation: Model.HasOneRelation,
        modelClass: Workspace,
        join: {
          from: 'process.workspace_id',
          to: 'workspace.id',
        },
      },
    }
  }
}

export default function (app: Application): typeof Process {
  return Process
}
