import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {
  /**
   * Vue ensemble des commandes
   */
  await knex('table_view').insert([
    {
      id: VIEWS.SUPPLIER.REQUEST,
      text: 'Ensemble des commandes',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SUPPLIER_USER,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: false,
      filter: {
        $eq: '{userId}'
      }
    },
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.BENEFICIARY,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.ADDRESS,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.LOT,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 6
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VAE,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 7
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 8
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_TRI,
      table_view_id: VIEWS.SUPPLIER.REQUEST,
      visible: true,
      position: 9
    }
  ])

  /**
   * Vue flotte vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.SUPPLIER.FLEET,
      text: 'Vélo fournisseur',
      table_id: TABLES.BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.BIKE.COLUMNS.SUPPLIER_USER,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: false,
      filter: {
        $eq: '{userId}'
      }
    },
    {
      table_column_id: TABLES.BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.REF,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.BENEFICIARY,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STARTING_DATE,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 6
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 7
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 8
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.PROVIDER,
      table_view_id: VIEWS.SUPPLIER.FLEET,
      visible: true,
      position: 9
    }
  ])

  /**
   * Vue maintenance préventive vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      text: 'Fournisseur Maintenance préventive',
      table_id: TABLES.MAINTENANCE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.SUPPLIER_USER,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: false,
      filter: {
        $eq: '{userId}'
      }
    },
    {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.TYPE,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: false,
      filter: {
        $eq: '2'
      }
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.BIKE_TYPE,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.IDENTITY,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.BIKE_STATUS,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.BENEFICIARY,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.TECHNICIAN,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: true,
      position: 6
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_STEP,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_PREVENTIVE,
      visible: true,
      position: 7
    }
  ])

  /**
   * Vue maintenance curative vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE,
      text: 'Vélo fournisseur',
      table_id: TABLES.MAINTENANCE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.SUPPLIER_USER,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE,
      visible: false,
      filter: {
        $eq: '{userId}'
      }
    },
    {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.TYPE,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE,
      visible: false,
      filter: {
        $eq: '1'
      }
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.BIKE_TYPE,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.IDENTITY,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.INCIDENT,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.MAINTENANCE.COLUMNS.BENEFICIARY,
      table_view_id: VIEWS.SUPPLIER.MAINTENANCE_CURATIVE,
      visible: true,
      position: 5
    }
  ])

}
