// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, Model, RelationMappings } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { chapter as LckChapter } from './chapter.model'
import { database as LckDatabase } from './database.model'
import { Process } from './process.model'

export class workspace extends BaseModel {
  text!: string
  chapters?: LckChapter[]
  databases?: LckDatabase[]

  static get tableName (): string {
    return 'workspace'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      chapters: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckChapter,
        join: {
          from: 'workspace.id',
          to: 'chapter.workspace_id',
        },
      },
      databases: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckDatabase,
        join: {
          from: 'workspace.id',
          to: 'database.workspace_id',
        },
      },
      processes: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: Process,
        join: {
          from: 'workspace.id',
          to: 'process.workspace_id',
        },
      },
    }
  }
}

export default function (app: Application): typeof workspace {
  return workspace
}
