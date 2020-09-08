import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {
/**
   * Vue ensemble de mes vélos
   */
  await knex('table_view').insert([
    {
      id: VIEWS.BENEFICIARY.BICYCLE_USE,
      text: 'Ensemble de mes vélos',
      table_id: TABLES.BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.BIKE.COLUMNS.BENEFICIARY_USER,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: false,
      filter: {
        $eq: '{userId}'
      }
    },
    {
      table_column_id: TABLES.BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.REF,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STARTING_DATE,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: true,
      position: 6
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.LAST_TRACER_DATA,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: true,
      position: 7
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.ALERT,
      table_view_id: VIEWS.BENEFICIARY.BICYCLE_USE,
      visible: true,
      position: 8
    }
  ])

  /**
   * Vue ensemble de mes formations
   */
  await knex('table_view').insert([
    {
      id: VIEWS.BENEFICIARY.TRAINING,
      text: 'Ensemble de mes formations',
      table_id: TABLES.TRAINING.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.TRAINING.COLUMNS.BENEFICIARY_USER,
      table_view_id: VIEWS.BENEFICIARY.TRAINING,
      visible: false,
      filter: {
        $eq: '{userId}'
      }
    },
    {
      table_column_id: TABLES.TRAINING.COLUMNS.TYPE,
      table_view_id: VIEWS.BENEFICIARY.TRAINING,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.INSTITUTION,
      table_view_id: VIEWS.BENEFICIARY.TRAINING,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.TRAINER,
      table_view_id: VIEWS.BENEFICIARY.TRAINING,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.FILE,
      table_view_id: VIEWS.BENEFICIARY.TRAINING,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.DATE,
      table_view_id: VIEWS.BENEFICIARY.TRAINING,
      visible: true,
      position: 5
    }
  ])
}
