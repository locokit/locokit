import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.table('column_type').insert([{
    id: 18,
    text: 'GEOMETRY_POINT'
  }, {
    id: 19,
    text: 'GEOMETRY_POLYGON'
  }, {
    id: 20,
    text: 'GEOMETRY_LINESTRING'
  }])
}

export async function down (knex: Knex): Promise<any> {
  return knex.table('column_type').whereIn('id', [18, 19, 20]).del()
}
