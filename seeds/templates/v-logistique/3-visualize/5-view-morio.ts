import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {
 /**
   * Vue ensemble des incidents de vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.MORIO.INCIDENT,
      text: 'Ensemble des incidents de vélo',
      table_id: TABLES.INCIDENT.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.INCIDENT.COLUMNS.SOCIETY,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.INCIDENT.COLUMNS.BIKE,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.INCIDENT.COLUMNS.STATUS,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.INCIDENT.COLUMNS.TYPE,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.INCIDENT.COLUMNS.DATE,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true,
      position: 5
    }
  ])

  /**
   * Vue ensemble des traceurs
   */
  await knex('table_view').insert([
    {
      id: VIEWS.MORIO.TRACER,
      text: 'Ensemble des traceurs',
      table_id: TABLES.MORIO_TRACER.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.SOCIETY,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.BIKE,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.REF,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.SIGFOX_ID,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.BIKE_STATUS,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.STATUS,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true,
      position: 6
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.DATE_BEGIN,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true,
      position: 7
    }
  ])
}
