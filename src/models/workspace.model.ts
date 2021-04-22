// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, Model, RelationMappings } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { chapter as LckChapter } from './chapter.model'
import { database as LckDatabase } from './database.model'
import { LckAttachment } from './attachment.model'
import { Process } from './process.model'
import { Group } from './group.model'

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
      attachments: {
        relation: Model.HasManyRelation,
        modelClass: LckAttachment,
        join: {
          from: 'workspace.id',
          to: 'attachment.workspace_id',
        },
      },
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
      groups: {
        relation: Model.HasManyRelation,
        modelClass: Group,
        join: {
          from: 'workspace.id',
          to: 'group.workspace_id',
        },
      },
    }
  }
}

export default function (app: Application): typeof workspace {
  return workspace
}
