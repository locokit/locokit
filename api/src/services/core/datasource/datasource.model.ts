import { Model, RelationMappings } from 'objection'
import { WorkspaceModel } from '../workspace/workspace.model'

export class DatasourceModel extends Model {
  static readonly model = 'datasource'

  static readonly tableName = 'lck_datasource'

  static get relationMappings(): RelationMappings {
    return {
      workspace: {
        relation: Model.HasOneRelation,
        modelClass: WorkspaceModel,
        join: {
          from: 'lck_datasource.workspaceId',
          to: 'lck_workspace.id',
        },
      },
    }
  }
}