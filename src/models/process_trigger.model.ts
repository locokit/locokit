/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection'
import { Application } from '../declarations'
import { Process } from './process.model'
import { ProcessExecution } from './process_execution.model'
import { TableColumn } from './tablecolumn.model'
import { BaseModel } from './base.model'

export enum ProcessTriggerEvent {
  CREATE_ROW = 'CREATE_ROW', // when a row in inserted
  UPDATE_ROW = 'UPDATE_ROW', // when a row is updated, no matter which data
  DELETE_ROW = 'DELETE_ROW', // when a row is removed
  UPDATE_ROW_DATA = 'UPDATE_ROW_DATA', // when a data in a row is updated
  CRON = 'CRON',
  MANUAL = 'MANUAL',
}

export class ProcessTrigger extends BaseModel {
  text?: string;
  event!: ProcessTriggerEvent;
  settings?: object;
  process_id!: string;
  table_id?: string;
  process?: Process;

  static get tableName (): string {
    return 'process_trigger'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: [
        'process_id'
      ],

      properties: {
        id: { type: 'string' },
        text: { type: 'string' },
        event: { type: 'string' },
        settings: { type: 'object' },
        process_id: { type: 'string' },
        table_id: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
    return {
      process: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: Process,
        join: {
          from: 'process_trigger.process_id',
          to: 'process.id'
        }
      },
      executions: {
        relation: Model.HasManyRelation,
        modelClass: ProcessExecution,
        join: {
          from: 'process_trigger.id',
          to: 'process_execution.process_trigger_id'
        }
      },
      table: {
        relation: Model.BelongsToOneRelation,
        modelClass: TableColumn,
        join: {
          from: 'process_trigger.table_id',
          to: 'table.id'
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

export default function (app: Application): typeof ProcessTrigger {
  return ProcessTrigger
}
