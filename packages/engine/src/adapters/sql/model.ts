import { Model } from 'objection'

export class EngineModel extends Model {
  static hasGeomTable: boolean
  static geomTables: string[]
}
