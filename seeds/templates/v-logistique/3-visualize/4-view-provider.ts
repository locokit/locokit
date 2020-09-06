import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {
  /**
   * Vue ensemble des commandes
   */
  await knex('table_view').insert([
    {
      id: VIEWS.PROVIDER.REQUEST,
      text: 'Ensemble des commandes',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.PERSON,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.ADDRESS,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.LOT,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VAE,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_TRI,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }
  ])

  /**
   * Vue flotte vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.PROVIDER.FLEET,
      text: 'Vélo fournisseur',
      table_id: TABLES.BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.REF,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.PROVIDER,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.RECIPIENT,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }
  ])

  /**
   * Vue maintenance préventive vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      text: 'Vélo fournisseur',
      table_id: TABLES.MAINTENANCE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.TYPE,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.IDENTITY,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.STATUS,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: false
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.RECIPIENT,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.TECHNICIAN,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_STEP,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }
  ])

  /**
   * Vue maintenance curative vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      text: 'Vélo fournisseur',
      table_id: TABLES.MAINTENANCE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.TYPE,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.IDENTITY,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.INCIDENT,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.RECIPIENT,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }
  ])

}
