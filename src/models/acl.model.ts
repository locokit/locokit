// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, Model, RelationMappings } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'
import { workspace as LckWorkspace } from './workspace.model'
import { chapter as LckChapter } from './chapter.model'
import { Group } from './group.model'

export class LckAcl extends BaseModel {
  name!: string
  workspace_id!: string
  workspace?: LckWorkspace
  chapter_id?: string
  chapter?: LckChapter
  manager!: boolean

  static get tableName (): string {
    return 'acl_set'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['name', 'workspace_id'],

      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        name: { type: 'string' },
        workspace_id: {
          type: 'string',
          format: 'uuid',
        },
        chapter_id: {
          type: 'string',
          format: 'uuid',
        },
        manager: { type: 'boolean' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      workspace: {
        relation: Model.HasOneRelation,
        modelClass: LckWorkspace,
        join: {
          from: 'acl_set.workspace_id',
          to: 'workspace.id',
        },
      },
      chapter: {
        relation: Model.HasOneRelation,
        modelClass: LckChapter,
        join: {
          from: 'acl_set.chapter_id',
          to: 'chapter.id',
        },
      },
      groups: {
        relation: Model.HasManyRelation,
        modelClass: Group,
        join: {
          from: 'acl_set.id',
          to: 'group.aclset_id',
        },
      },
    }
  }
}

export default function (app: Application): typeof LckAcl {
  return LckAcl
}
