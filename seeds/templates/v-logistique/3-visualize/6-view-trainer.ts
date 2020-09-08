import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {

  /**
   * Vue ensemble des formations
   */
  await knex('table_view').insert([
    {
      id: VIEWS.FUB.FORMATION,
      text: 'Ensemble des formations',
      table_id: TABLES.TRAINING.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.TRAINING.COLUMNS.SOCIETY,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.BIKE,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.TYPE,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.DATE,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.STATUS,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.TRAINER,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true,
      position: 6
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.INSTITUTION,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true,
      position: 7
    }
  ])
}
