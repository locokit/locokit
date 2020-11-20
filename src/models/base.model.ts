import { Model } from 'objection'

export class BaseModel extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;

  $beforeInsert () {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }
}
