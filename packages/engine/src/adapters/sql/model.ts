import { Model } from 'objection'

export class EngineModel extends Model {
  static hasGeomColumn: boolean
  static geomColumns: string[]
}
