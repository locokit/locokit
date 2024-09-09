import { Model } from 'objection'

export class WorkflowModel extends Model {
  static readonly model = 'workflow'

  static readonly tableName = 'workflow'
}
