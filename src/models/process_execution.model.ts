/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

export enum ProcessExecutionStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  RUNNING = 'RUNNING'
}
export class ProcessExecution extends BaseModel {
  when?: Date;
  status?: ProcessExecutionStatus;
  duration?: number;
  log?: string;
  settings?: object;
  process_trigger_id!: string;
  table_row_id?: string;

  static get tableName (): string {
    return 'process_execution'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: [
        'process_trigger_id'
      ],

      properties: {
        id: { type: 'string' },
        when: { type: 'Date' },
        result: { type: 'string' },
        duration: { type: 'number' },
        log: { type: 'string' },
        settings: { type: 'object' },
        process_trigger_id: { type: 'string' },
        table_row_id: { type: 'string' }
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

export default function (app: Application): typeof ProcessExecution {
  return ProcessExecution
}
