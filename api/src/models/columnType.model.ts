// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { JSONSchema } from 'objection'

export class ColumnType extends BaseModel {
  text!: string

  static get tableName (): string {
    return 'column_type'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
      },
    }
  }
}

export default function (app: Application): typeof ColumnType {
  return ColumnType
}
