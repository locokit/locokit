// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, Model, RelationMappings } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { chapter as LckChapter } from './chapter.model'
import { database as LckDatabase } from './database.model'
import { LckAttachment } from './attachment.model'
import { Process } from './process.model'
import { LckAclSet } from './aclset.model'

export class workspace extends BaseModel {
  text!: string
  documentation?: string
  chapters?: LckChapter[]
  databases?: LckDatabase[]
  attachments?: LckAttachment[]
  aclsets?: LckAclSet[]

  static readonly modelName = 'workspace'

  static get tableName (): string {
    return 'workspace'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
        documentation: { type: 'string' },
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
        modelClass: LckChapter,
        join: {
          from: 'workspace.id',
          to: 'chapter.workspace_id',
        },
      },
      databases: {
        relation: Model.HasManyRelation,
        modelClass: LckDatabase,
        join: {
          from: 'workspace.id',
          to: 'database.workspace_id',
        },
      },
      processes: {
        relation: Model.HasManyRelation,
        modelClass: Process,
        join: {
          from: 'workspace.id',
          to: 'process.workspace_id',
        },
      },
      aclsets: {
        relation: Model.HasManyRelation,
        modelClass: LckAclSet,
        join: {
          from: 'workspace.id',
          to: 'acl_set.workspace_id',
        },
      },
    }
  }
}

export default function (app: Application): typeof workspace {
  return workspace
}
