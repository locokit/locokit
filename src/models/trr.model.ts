// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection';
import { Application } from '../declarations';

export class LCK_trr extends Model {
  createdAt!: string;
  updatedAt!: string;
  table_row_from_id!: string;
  table_row_to_id!: string;
  table_column_to_id!: string;

  static get idColumn() {
    return ['table_row_to_id', 'table_column_to_id'];
  }

  static get tableName(): string {
    return 'table_row_relation';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: [
        'table_row_from_id',
        'table_row_to_id',
        'table_column_to_id'
      ],

      properties: {
        table_row_from_id: { type: 'string' },
        table_row_to_id: { type: 'string' },
        table_column_to_id: { type: 'string' },
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

export default function (app: Application): typeof LCK_trr {
  return LCK_trr;
}
