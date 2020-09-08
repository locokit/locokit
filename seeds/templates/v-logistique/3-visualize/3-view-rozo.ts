import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {
    /**
   * Vue ensemble des pré bénéficiaires
   */
  await knex('table_view').insert([
    {
      id: VIEWS.ROZO.BENEFICIARY,
      text: 'Ensemble des pré-bénéficiaires',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.ROZO.BENEFICIARY,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.BENEFICIARY,
      table_view_id: VIEWS.ROZO.BENEFICIARY,
      visible: true,
      position: 2,
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.ROZO.BENEFICIARY,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.ROZO.BENEFICIARY,
      visible: true,
      position: 4,
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STEP,
      table_view_id: VIEWS.ROZO.BENEFICIARY,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STEP_STATUS,
      table_view_id: VIEWS.ROZO.BENEFICIARY,
      visible: true,
      position: 6
    }
  ])

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
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS_PERSON,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STEP,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true,
      position: 4,
      filter: {
        $nin: ['5']
      }
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STEP_STATUS,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true,
      position: 5
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
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.LAST_TRACER_DATA,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.SUPPLIER,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.PROVIDER,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true,
      position: 6
    }
  ])


}
