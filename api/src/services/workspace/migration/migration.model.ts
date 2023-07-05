import { Model } from 'objection'

export class MigrationModel extends Model {
  static readonly model = 'migration'

  static readonly tableName = 'migration'
}
