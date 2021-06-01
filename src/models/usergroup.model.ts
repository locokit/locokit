/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { JSONSchema, Model, RelationMappings } from 'objection'
import { Application } from '../declarations'
import { User } from './user.model'
import { Group } from './group.model'
import { GROUP_ROLE } from '@locokit/lck-glossary'

export class Usergroup extends BaseModel {
  uhg_role!: GROUP_ROLE
  user_id!: number
  user?: User
  group_id!: string
  group?: Group

  static get idColumn (): string[] {
    return ['user_id', 'group_id']
  }

  static get tableName (): string {
    return 'user_has_group'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: [
        'user_id',
        'group_id',
      ],

      properties: {
        uhg_role: { type: 'string' },
        user_id: { type: 'number' },
        group_id: { type: 'string' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'user_has_group.user_id',
          to: 'user.id',
        },
      },
      group: {
        relation: Model.HasOneRelation,
        modelClass: Group,
        join: {
          from: 'user_has_group.group_id',
          to: 'group.id',
        },
      },
    }
  }
}

export default function (app: Application): typeof Usergroup {
  return Usergroup
}
