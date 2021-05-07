// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { block as LckBlock } from './block.model'
import { Model, RelationMappings, JSONSchema } from 'objection'

export class container extends BaseModel {
  position?: number
  displayed_in_navbar?: boolean
  anchor_label?: string
  anchor_icon?: string
  anchor_icon_class?: string
  display_title?: boolean

  static get tableName (): string {
    return 'container'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],
      properties: {
        text: { type: 'string' },
        position: { type: ['number', 'null'] },
        displayed_in_navbar: { type: 'boolean' },
        anchor_label: { type: 'string' },
        anchor_icon: { type: ['string', 'null'] },
        anchor_icon_class: { type: 'string' },
        display_title: { type: 'boolean' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      blocks: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckBlock,
        join: {
          from: 'container.id',
          to: 'block.container_id',
        },
      },
    }
  }
}

export default function (app: Application): typeof container {
  return container
}
