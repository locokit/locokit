import { JSONSchema, Model, Modifiers, QueryBuilder, RelationMappings } from 'objection'
import { BaseModel } from './base.model'
import { Chapter } from './chapter.model'
import { Database } from './database.model'
import { LckAttachment } from './attachment.model'
import { Process } from './process.model'
import { LckAclSet } from './aclset.model'
import { GeneralError } from '@feathersjs/errors'

export class Workspace extends BaseModel {
  /**
   * Workspace name
   */
  text!: string
  /**
   * Does this workspace have a dedicated SQL schema ?
   */
  generate_sql!: boolean
  /**
   * Workspace's slug, used for create a SQL schema.
   * Set only if `generate_sql` is true
   */
  slug?: string
  documentation?: string
  settings?: {
    color: string;
    backgroundColor: string;
    icon: string;
  }
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
        text: {
          description: 'Name of the workspace',
          type: 'string'
        },
        generate_sql: {
          description: 'Does this workspace generate a SQL schema ?',
          type: 'boolean',
          default: false
        },
        slug: {
          description: 'slug used to create the SQL schema if needed',
          type: 'string'
        },
        documentation: {
          description: 'Workspace\'s documentation, what is the aim of this workspace.',
          type: 'string'
        },
        settings: {
          description: 'Workspace\'s settings, for display purpose.',
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
