import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

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
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.REF,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.REQUEST,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.COMMISSIONING_DATE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.RECIPIENT,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.PROVIDER,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.TRACER,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.BIKE.COLUMNS.LAST_TRACER_DATA,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }
  ])

  /**
   * Vue ensemble des pré bénéficiaires
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.PRE_RECIPIENT,
      text: 'Ensemble des pré-bénéficiaires',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    // }, {
    //   table_column_id: TABLES.REQUEST.COLUMNS.USER,
    //   table_view_id: VIEWS.VLO.PRE_RECIPIENT,
    //   visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.EMAIL,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.PHONE,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.ADDRESS,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.LOT,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.APE,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VAE,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_TRI,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }
  ])

  /**
   * Vue ensemble des bénéficiaires
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.RECIPIENT,
      text: 'Ensemble des bénéficiaires',
      table_id: TABLES.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
    //   table_column_id: TABLES.REQUEST.COLUMNS.USER,
    //   table_view_id: VIEWS.VLO.RECIPIENT,
    //   visible: true
    // }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.EMAIL,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.PHONE,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.ADDRESS,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.LOT,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.APE,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VAE,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NB_VCAE_TRI,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
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
      table_column_id: TABLES.REQUEST.COLUMNS.NAME,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.TYPE,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.CREATION_DATE,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STEP,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }
  ])

  /**
   * Vue ensemble des fournisseurs
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.PROVIDER,
      text: 'Ensemble des fournisseurs',
      table_id: TABLES.PROVIDER.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.PROVIDER.COLUMNS.NAME,
      table_view_id: VIEWS.VLO.PROVIDER,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.COLUMNS.USER,
      table_view_id: VIEWS.VLO.PROVIDER,
      visible: true
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
    //   visible: true
    // }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.TYPE,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.REF,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true
    }, {
      table_column_id: TABLES.MORIO_TRACER.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true
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
      table_column_id: TABLES.TRAINING.COLUMNS.USER,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.FILE,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.DATE,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.TRAINING.COLUMNS.RATING,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true
    }
  ])
}
