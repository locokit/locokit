import * as Knex from 'knex'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

export async function up (knex: Knex): Promise<any> {
  return knex.table('column_type').insert([{
    id: COLUMN_TYPE.DATETIME,
    text: 'DATETIME'
  }, {
    id: COLUMN_TYPE.GEOMETRY_MULTIPOINT,
    text: 'GEOMETRY_MULTIPOINT'
  }, {
    id: COLUMN_TYPE.GEOMETRY_MULTIPOLYGON,
    text: 'GEOMETRY_MULTIPOLYGON'
  }, {
    id: COLUMN_TYPE.GEOMETRY_MULTILINESTRING,
    text: 'GEOMETRY_MULTILINESTRING'
  }])
}

export async function down (knex: Knex): Promise<any> {
  return knex.table('column_type').whereIn('id', [21, 22, 23, 24]).del()}
