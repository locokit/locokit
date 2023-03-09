import { Model, RelationMappings } from 'objection'
import BaseModel from '../../../commons/BaseModel'
import { WorkspaceModel } from '@/services/core/workspace/core-workspace.model'

export class UserModel extends BaseModel {
  static readonly model = 'user'

  static readonly tableName = 'lck_user'

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
