// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, Model, Modifiers, QueryBuilder, RelationMappings } from 'objection'
import { BaseModel } from './base.model'
import { Chapter } from './chapter.model'
import { Database } from './database.model'
import { LckAttachment } from './attachment.model'
import { Process } from './process.model'
import { LckAclSet } from './aclset.model'
import { GeneralError } from '@feathersjs/errors'

export class Workspace extends BaseModel {
  text!: string
  slug!: string
  documentation?: string
  settings?: object
  chapters?: Chapter[]
  databases?: Database[]
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
        slug: { type: 'string' },
        documentation: { type: 'string' },
        settings: {
          type: 'object',
          properties: {
            color: { type: 'string' },
            backgroundColor: { type: 'string' },
            icon: { type: 'string' },
          },
        },
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
        modelClass: Chapter,
        join: {
          from: 'workspace.id',
          to: 'chapter.workspace_id',
        },
      },
      databases: {
        relation: Model.HasManyRelation,
        modelClass: Database,
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

  static get modifiers (): Modifiers {
    return {
      ofUser: async (builder: QueryBuilder<Workspace>, userId: number) => {
        if (!userId) throw new GeneralError('Missing user id for modifier ofUser. Please check your API call.')

        return await builder.withGraphJoined('[aclsets.[groups.[users]]]')
          .where('aclsets:groups:users.id', userId)
      },
    }
  }
}

export default function (): typeof Workspace {
  return Workspace
}
