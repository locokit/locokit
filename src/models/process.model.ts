/* eslint-disable camelcase */
// See// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection'
import { Application } from '../declarations'
import { workspace as LckWorkspace } from './workspace.model'
import { ProcessTrigger } from './process_trigger.model'
import { BaseModel } from './base.model'

export class Process extends BaseModel {
  text?: string;
  url?: string;
  settings?: object;
  workspace_id!: string;
  workspace?: LckWorkspace;

  static get tableName (): string {
    return 'process'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['workspace_id'],

      properties: {
        id: { type: 'string' },
        text: { type: 'string' },
        url: { type: 'string' },
        settings: { type: 'object' },
        workspace_id: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
    return {
      workspace: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckWorkspace,
        join: {
          from: 'process.workspace_id',
          to: 'workspace.id'
        }
      },
      triggers: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: ProcessTrigger,
        join: {
          from: 'process.id',
          to: 'process_trigger.process_id'
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

export default function (app: Application): typeof Process {
  return Process
}
