import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {
/**
   * Vue ensemble de mes vélos
   */
  await knex('table_view').insert([
    {
      id: VIEWS.RECIPIENT.BICYCLE_USE,
      text: 'Ensemble de mes vélos',
      table_id: TABLES.BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.REF,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.COMMISSIONING_DATE,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.LAST_TRACER_DATA,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.ALERT,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }
  ])

  /**
   * Vue ensemble de mes formations
   */
  await knex('table_view').insert([
    {
      id: VIEWS.RECIPIENT.AWARENESS,
      text: 'Ensemble de mes formations',
      table_id: TABLES.TRAINING.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.TRAINING.COLUMNS.TYPE,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.INSTITUTION,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.TRAINER,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.FILE,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.DATE,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }
  ])
}
