// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

class Attachment extends BaseModel {
  path!: string;
  createdAt!: string;
  updatedAt!: string;

  static get tableName (): string {
    return 'attachment'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['path'],

      properties: {
        path: { type: 'string' }
      }
    }
  }

  $beforeInsert (): void {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate (): void {
    this.updatedAt = new Date().toISOString()
  }
}

export default function (app: Application): typeof Attachment {
  return Attachment
}
