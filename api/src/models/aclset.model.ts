// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, Model, RelationMappings } from 'objection'
import { BaseModel } from './base.model'
import { Workspace } from './workspace.model'
import { Chapter } from './chapter.model'
import { Group } from './group.model'
import { LckAclTable } from './acltable.model'

export class LckAclSet extends BaseModel {
  label!: string
  workspace_id!: string
  workspace?: Workspace
  chapter_id?: string
  chapter?: Chapter
  manager!: boolean
  groups?: Group[]
  acltables?: LckAclTable[]

  static get tableName (): string {
    return 'acl_set'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['label', 'workspace_id'],

      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        label: { type: 'string' },
        workspace_id: {
          type: 'string',
          format: 'uuid',
        },
        chapter_id: {
          type: ['string', 'null'],
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
        modelClass: Workspace,
        join: {
          from: 'acl_set.workspace_id',
          to: 'workspace.id',
        },
      },
      chapter: {
        relation: Model.HasOneRelation,
        modelClass: Chapter,
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
      /**
       * This relation is used only for CASL abilities.
       * This could avoid conflicts with end users
       * joining with ORM-wrapper feathers-objection
       * and $joinRelation
       */
      groupsacl: {
        relation: Model.HasManyRelation,
        modelClass: Group,
        join: {
          from: 'acl_set.id',
          to: 'group.aclset_id',
        },
      },
      acltables: {
        relation: Model.HasManyRelation,
        modelClass: LckAclTable,
        join: {
          from: 'acl_set.id',
          to: 'acl_table.aclset_id',
        },
      },
    }
  }
}

export default function (): typeof LckAclSet {
  return LckAclSet
}
