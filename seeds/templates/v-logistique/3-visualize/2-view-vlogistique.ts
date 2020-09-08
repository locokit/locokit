import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'
import { VALUES } from '../glossary/value_single_select'

export async function seed (knex: Knex): Promise<any> {

  /**
   * View Stock vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.BICYCLE_STOCK,
      text: 'Vélo bénéficiaire',
      table_id: TABLES.BIKE.ID
    }
  ])
  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.REF,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.LOT,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.SUPPLIER,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 6
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.SOCIETY,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 7
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.BENEFICIARY,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 8
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 9
    // }, {
    //   table_column_id: TABLES.BIKE.COLUMNS.STARTING_DATE,
    //   table_view_id: VIEWS.VLO.BICYCLE_STOCK,
    //   visible: true,
    //   position: 1
    // }, {
    //   table_column_id: TABLES.BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
    //   table_view_id: VIEWS.VLO.BICYCLE_STOCK,
    //   visible: true,
    //   position: 1
    // }, {
    //   table_column_id: TABLES.BIKE.COLUMNS.BENEFICIARY,
    //   table_view_id: VIEWS.VLO.BICYCLE_STOCK,
    //   visible: true,
    //   position: 1
    // }, {
    //   table_column_id: TABLES.BIKE.COLUMNS.SUPPLIER,
    //   table_view_id: VIEWS.VLO.BICYCLE_STOCK,
    //   visible: true,
    //   position: 1
    // }, {
    //   table_column_id: TABLES.BIKE.COLUMNS.TRACER,
    //   table_view_id: VIEWS.VLO.BICYCLE_STOCK,
    //   visible: true,
    //   position: 1
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true,
      position: 10
    }
  ])

  /**
   * Vue ensemble des pré bénéficiaires
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.PRE_BENEFICIARY,
      text: 'Ensemble des pré-bénéficiaires',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.BENEFICIARY,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 2,
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 3,
      filter: {
        $in: [3]
      }
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 4
    }, {
    //   table_column_id: TABLES.REQUEST.COLUMNS.EMAIL,
    //   table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
    //   visible: true,
    //   position: 4
    // }, {
    //   table_column_id: TABLES.REQUEST.COLUMNS.PHONE,
    //   table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
    //   visible: true,
    //   position: 5
    // }, {
      table_column_id: TABLES.REQUEST.COLUMNS.ADDRESS,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.LOT,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 6
    }, {
    //   table_column_id: TABLES.REQUEST.COLUMNS.APE,
    //   table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
    //   visible: true,
    //   position: 7
    // }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VAE,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 8
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 9
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_TRI,
      table_view_id: VIEWS.VLO.PRE_BENEFICIARY,
      visible: true,
      position: 10
    }
  ])

  /**
   * Vue ensemble des bénéficiaires
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.BENEFICIARY,
      text: 'Ensemble des bénéficiaires',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.BENEFICIARY,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 2,
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 3,
      filter: {
        $in: [2]
      }
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 4
    }, {
    //   table_column_id: TABLES.REQUEST.COLUMNS.EMAIL,
    //   table_view_id: VIEWS.VLO.BENEFICIARY,
    //   visible: true,
    //   position: 4
    // }, {
    //   table_column_id: TABLES.REQUEST.COLUMNS.PHONE,
    //   table_view_id: VIEWS.VLO.BENEFICIARY,
    //   visible: true,
    //   position: 5
    // }, {
      table_column_id: TABLES.REQUEST.COLUMNS.ADDRESS,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.LOT,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 6
    }, {
    //   table_column_id: TABLES.REQUEST.COLUMNS.APE,
    //   table_view_id: VIEWS.VLO.BENEFICIARY,
    //   visible: true,
    //   position: 8
    // }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VAE,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 7
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 8
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_TRI,
      table_view_id: VIEWS.VLO.BENEFICIARY,
      visible: true,
      position: 9
    }
  ])

  /**
   * Vue ensemble rozo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.ROZO,
      text: 'Ensemble Rozo',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS_PERSON,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.CREATION_DATE,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STEP,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true,
      position: 5
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STEP_STATUS,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true,
      position: 6
    }
  ])

  /**
   * Vue ensemble des fournisseurs
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.SUPPLIER,
      text: 'Ensemble des fournisseurs',
      table_id: TABLES.SUPPLIER.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.SUPPLIER.COLUMNS.NAME,
      table_view_id: VIEWS.VLO.SUPPLIER,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.SUPPLIER.COLUMNS.GEOZONE,
      table_view_id: VIEWS.VLO.SUPPLIER,
      visible: true,
      position: 2
    }
  ])

  /**
   * Vue ensemble des traceurs
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.MORIO,
      text: 'Ensemble des traceurs',
      table_id: TABLES.MORIO_TRACER.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
    //   table_column_id: TABLES.MORIO_TRACER.COLUMNS.USER,
    //   table_view_id: VIEWS.VLO.MORIO,
    //   visible: true,
    // }, {
    //   table_column_id: TABLES.MORIO_TRACER.COLUMNS.TYPE,
    //   table_view_id: VIEWS.VLO.MORIO,
    //   visible: true,
    //   position: 1
    // }, {
    //   table_column_id: TABLES.MORIO_TRACER.COLUMNS.NUM_REQUEST,
    //   table_view_id: VIEWS.VLO.MORIO,
    //   visible: true,
    //   position: 2
    // }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.REF,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true,
      position: 4
    }
  ])

  /**
   * Vue ensemble des formations et assistances
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.FORMATION,
      text: 'Ensemble des formations et assistances',
      table_id: TABLES.TRAINING.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.TRAINING.COLUMNS.BENEFICIARY_USER,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true,
      position: 1
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.FILE,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true,
      position: 2
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.INSTITUTION,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true,
      position: 3
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.DATE,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true,
      position: 4
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.RATING,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true,
      position: 5
    }
  ])
}
