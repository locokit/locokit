import type { KnexAdapterParams } from '@feathersjs/knex'

import type { TableRelationData, TableRelationResult, TableRelationQuery } from './table-relation.schema'
import { ObjectionService } from '@/feathers-objection'

export interface TableRelationParams extends KnexAdapterParams<TableRelationQuery> { }

export class TableRelation extends ObjectionService<TableRelationResult, TableRelationData, TableRelationParams> { }
