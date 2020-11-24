// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'

export class ColumnType extends BaseModel {
  text!: string;

  static get tableName () {
    return 'column_type'
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
}

export default function (app: Application) {
  return ColumnType
}
