import { JSONSchema, Model, RelationMappings } from 'objection'
import { GroupModel } from '../auth/group/group.model'
import { RoleModel } from '../auth/role/role.model'
import { UserModel } from '../auth/user/user.model'
import { DatasourceModel } from './datasource/datasource.service'
import { workspaceSchema } from './workspace.schema'

/**
 * Workspace objection Model
 */
export class WorkspaceModel extends Model {
  static readonly model = 'workspace'

  static readonly tableName = 'lck_workspace'

  static get jsonSchema(): JSONSchema {
    return workspaceSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      datasources: {
        relation: Model.HasManyRelation,
        modelClass: DatasourceModel,
        join: {
          from: 'lck_workspace.id',
          to: 'lck_datasource.workspaceId',
        },
      },
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'lck_workspace.createdBy',
          to: 'lck_user.id',
        },
      },
      groups: {
        relation: Model.HasManyRelation,
        modelClass: GroupModel,
        join: {
          from: 'lck_workspace.id',
          to: 'lck_group.workspaceId',
        },
      },
      roles: {
        relation: Model.HasManyRelation,
        modelClass: RoleModel,
        join: {
          from: 'lck_workspace.id',
          to: 'lck_role.workspaceId',
        },
      },
    }
  }
}
