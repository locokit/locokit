import { Model, RelationMappings } from 'objection'
import { WorkspaceModel } from '../../workspace/workspace.model'
import { GroupModel } from '../group/group.model'

/**
 * Role objection Model
 */
export class RoleModel extends Model {
  static readonly model = 'role'

  static readonly tableName = 'lck_role'

  static get relationMappings(): RelationMappings {
    return {
      workspace: {
        relation: Model.BelongsToOneRelation,
        modelClass: WorkspaceModel,
        join: {
          from: 'lck_role.workspaceId',
          to: 'lck_workspace.id',
        },
      },
      groups: {
        relation: Model.HasManyRelation,
        modelClass: GroupModel,
        join: {
          from: 'lck_role.id',
          to: 'lck_group.roleId',
        },
      },
    }
  }
}
