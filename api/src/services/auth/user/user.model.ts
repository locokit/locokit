import { JSONSchema, Model, RelationMappings } from 'objection'
import BaseModel from '../../../commons/BaseModel'
import { WorkspaceModel } from '../../workspace/workspace.model'
import { userSchema } from './user.schema'
import { Type } from '@feathersjs/typebox'

export class UserModel extends BaseModel {
  static readonly model = 'user'

  static readonly tableName = 'lck_user'

  static get jsonSchema(): JSONSchema {
    return Type.Omit(userSchema, ['id'])
  }

  static get relationMappings(): RelationMappings {
    return {
      workspaces: {
        relation: Model.HasManyRelation,
        modelClass: WorkspaceModel,
        join: {
          from: 'lck_user.id',
          to: 'lck_workspace.createdBy',
        },
      },
    }
  }
}
