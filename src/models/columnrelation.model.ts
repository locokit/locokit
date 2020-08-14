// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection';
import { Application } from '../declarations';

export class ColumnRelation extends Model {
  createdAt!: string;
  updatedAt!: string;
  column_from_id!: string;
  column_to_id!: string;

  static get tableName(): string {
    return 'table_column_relation';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['column_from_id', 'column_to_id'],

      properties: {
        column_from_id: { type: 'string' },
        column_to_id: { type: 'string' }
      }
    };
  }

  $beforeInsert(): void {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }
}

export default function (app: Application): typeof ColumnRelation {
  return ColumnRelation;
}
