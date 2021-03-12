/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, Model } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'
import { Process as ProcessModel } from './process.model'
import { TableRow } from './tablerow.model'

export enum ProcessRunStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  RUNNING = 'RUNNING',
}
export class ProcessRun extends BaseModel {
  status?: ProcessRunStatus;
  duration?: number;
  log?: string;
  settings?: object;
  process_id!: string;
  process?: ProcessModel;
  table_row_id?: string;
  table_row?: TableRow;

  static get tableName (): string {
    return 'process_run'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: [
        'process_id',
      ],

      properties: {
        id: { type: 'string' },
        when: { type: 'Date' },
        result: { type: 'string' },
        duration: { type: 'number' },
        log: { type: 'string' },
        settings: { type: 'object' },
        process_id: { type: 'string' },
        table_row_id: { type: 'string' },
      },
    }
  }

  static get relationMappings () {
    return {
      process: {
        relation: Model.HasOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: ProcessModel,
        join: {
          from: 'process_run.process_id',
          to: 'process.id',
        },
      },
      table_row: {
        relation: Model.HasOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: TableRow,
        join: {
          from: 'process_run.table_row_id',
          to: 'table_row.id',
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

export default function (app: Application): typeof ProcessRun {
  return ProcessRun
}
