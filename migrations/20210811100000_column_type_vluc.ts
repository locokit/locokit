import * as Knex from 'knex'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

export async function up (knex: Knex): Promise<any> {
  return knex.table('column_type').insert([{
    id: COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
    text: 'VIRTUAL_LOOKED_UP_COLUMN'
  }])
}

export async function down (knex: Knex): Promise<any> {
  return knex.table('column_type').whereIn('id', [25]).del()}
