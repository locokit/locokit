// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { block as LckBlock } from './block.model'
import { Model } from 'objection'

export class container extends BaseModel {
  static get tableName () {
    return 'container'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
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
          to: 'block.container_id'
        }
      }
    }
  }
}

export default function (app: Application) {
  return container
}
