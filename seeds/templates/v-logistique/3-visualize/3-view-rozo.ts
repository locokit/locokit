import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {
/**
   * Vue ensemble des dossiers
   */
  await knex('table_view').insert([
    {
      id: VIEWS.ROZO.FOLDER,
      text: 'Ensemble des dossiers',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS_PERSON,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS_FOLDER,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STEP,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS_PROGRAM,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_BIKE,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }
  ])

  /**
   * Vue ensemble des vélo utilisés
   */
  await knex('table_view').insert([
    {
      id: VIEWS.ROZO.BIKE,
      text: 'Ensemble des vélo utilisés',
      table_id: TABLES.BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.BIKE.COLUMNS.SOCIETY,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    // }, {
    //   table_column_id: TABLES.BIKE.COLUMNS.NB_BIKE,
    //   table_view_id: VIEWS.ROZO.BIKE,
    //   visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.PERIOD,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.PROVIDER,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    }
  ])


}
