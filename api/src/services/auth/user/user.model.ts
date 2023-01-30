import { JSONSchema, Model, RelationMappings } from 'objection'
import { WorkspaceModel } from '../../workspace/workspace.model'
import { userSchema } from './user.schema'

export class UserModel extends Model {
  static readonly model = 'user'

  static readonly tableName = 'lck_user'

  static get jsonSchema(): JSONSchema {
    return userSchema
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
