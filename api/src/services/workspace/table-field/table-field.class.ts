import type { KnexAdapterParams } from '@feathersjs/knex'

import type { TableFieldData, TableFieldResult, TableFieldQuery } from './table-field.schema'
import { ObjectionService } from '@/feathers-objection'

export interface TableFieldParams extends KnexAdapterParams<TableFieldQuery> { }

export class TableField extends ObjectionService<TableFieldResult, TableFieldData, TableFieldParams> { }
