import { Model } from 'objection'

export class BaseModel extends Model {
  id!: string
  createdAt!: string
  updatedAt!: string

  $beforeInsert (): void {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate (): void {
    this.updatedAt = new Date().toISOString()
  }
}
