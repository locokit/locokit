// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { Workspace } from './workspace.model'
import { Page } from './page.model'
import { Model, RelationMappings, JSONSchema } from 'objection'

export class Chapter extends BaseModel {
  title!: string
  position!: number
  settings!: object
  type!: string

  static get tableName (): string {
    return 'chapter'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        title: { type: 'string' },
        position: { type: 'number' },
        settings: { type: 'object' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      workspace: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: Workspace,
        join: {
          from: 'chapter.workspaceId',
          to: 'workspace.id',
        },
      },
      pages: {
        relation: Model.HasManyRelation,
        modelClass: Page,
        join: {
          from: 'chapter.id',
          to: 'page.chapter_id',
        },
      },
    }
  }
}

export default function (app: Application): typeof Chapter {
  return Chapter
}
