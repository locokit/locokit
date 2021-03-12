/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, RelationMappings, JSONSchema } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { container as LckContainer } from './container.model'

export class page extends BaseModel {
  id!: string
  text!: string
  chapter_id!: string
  hidden!: boolean

  static get tableName (): string {
    return 'page'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        id: { type: 'string' },
        text: { type: ['string', 'null'] },
        createdAt: { type: ['string', 'null'] },
        updatedAt: { type: ['string', 'null'] },
        chapter_id: { type: ['string', 'null'] },
        hidden: { type: ['boolean', 'null'] },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      containers: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckContainer,
        join: {
          from: 'page.id',
          to: 'container.page_id',
        },
      },
    }
  }
}

export default function (app: Application): typeof page {
  return page
}
