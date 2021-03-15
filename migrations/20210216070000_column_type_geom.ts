import * as Knex from 'knex'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

export async function up (knex: Knex): Promise<any> {
  return knex.table('column_type').insert([{
    id: COLUMN_TYPE.GEOMETRY_POINT,
    text: 'GEOMETRY_POINT'
  }, {
    id: COLUMN_TYPE.GEOMETRY_POLYGON,
    text: 'GEOMETRY_POLYGON'
  }, {
    id: COLUMN_TYPE.GEOMETRY_LINESTRING,
    text: 'GEOMETRY_LINESTRING'
  }])
}

export async function down (knex: Knex): Promise<any> {
  return knex.table('column_type').whereIn('id', [18, 19, 20]).del()
}
