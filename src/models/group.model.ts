/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { User } from './user.model'
import { workspace as LckWorkspace } from './workspace.model'
import { chapter as LckChapter } from './chapter.model'
import { Model, RelationMappings, JSONSchema } from 'objection'
import { Usergroup } from './usergroup.model'

export class Group extends BaseModel {
  workspace?: LckWorkspace
  chapter?: LckChapter
  chapter_id?: string
  workspace_role?: string
  name!: string
  users?: User[]
  usergroups?: Usergroup[]

  static get tableName (): string {
    return 'group'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: { type: 'string' },
        workspace_role: { type: 'string' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      workspace: {
        relation: Model.HasOneRelation,
        modelClass: LckWorkspace,
        join: {
          from: 'group.workspace_id',
          to: 'workspace.id',
        },
      },
      chapter: {
        relation: Model.HasOneRelation,
        modelClass: LckChapter,
        join: {
          from: 'group.chapter_id',
          to: 'chapter.id',
        },
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'group.id',
          through: {
            from: 'user_has_group.group_id',
            to: 'user_has_group.user_id',
            extra: ['uhg_role'],
          },
          to: 'user.id',
        },
      },
      usergroups: {
        relation: Model.HasManyRelation,
        modelClass: Usergroup,
        join: {
          from: 'group.id',
          to: 'user_has_group.group_id',
        },
      },
    }
  }
}

export default function (app: Application): typeof Group {
  return Group
}
