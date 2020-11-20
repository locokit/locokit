/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { JSONSchema } from 'objection'
import { Application } from '../declarations'

class Usergroup extends BaseModel {
  uhg_role!:string;
  user_id!:number;
  group_id!:string;

  static get idColumn () {
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
        'group_id'
      ],

      properties: {
        uhg_role: { type: 'string' },
        user_id: { type: 'number' },
        group_id: { type: 'string' }
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

export default function (app: Application): typeof Usergroup {
  return Usergroup
}
