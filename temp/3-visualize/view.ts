import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { VIEWS } from '../glossary/view'

export async function seed (knex: Knex): Promise<any> {
  // View Fournisseur
  /**
   * Vue ensemble des commandes
   */
  await knex('table_view').insert([
    {
      id: VIEWS.PROVIDER.REQUEST,
      text: 'Ensemble des commandes',
      table_id: TABLES.PROVIDER.REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.SOCIETY,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.PERSON,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.STATUS,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.ADDRESS,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.LOT,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.NB_VAE,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.PROVIDER.REQUEST,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_TRI,
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
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.IDENTITY,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.PROVIDER,
      table_view_id: VIEWS.PROVIDER.FLEET,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.RECIPIENT,
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
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.IDENTITY,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: false
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.RECIPIENT,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TECHNICIAN,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_PREVENTIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_STEP,
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
      table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.IDENTITY,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.INCIDENT,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }, {
      table_column_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.RECIPIENT,
      table_view_id: VIEWS.PROVIDER.MAINTENANCE_CURATIVE,
      visible: true
    }
  ])


  // View Bénéficiare


  /**
   * Vue ensemble de mes vélos
   */
  await knex('table_view').insert([
    {
      id: VIEWS.RECIPIENT.BICYCLE_USE,
      text: 'Ensemble de mes vélos',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.IDENTITY,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.COMMISSIONING_DATE,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.LAST_TRACER_DATA,
      table_view_id: VIEWS.RECIPIENT.BICYCLE_USE,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.ALERT,
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
      table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.TYPE,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.INSTITUTION,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.TRAINER,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.FILE,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }, {
      table_column_id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.DATE,
      table_view_id: VIEWS.RECIPIENT.AWARENESS,
      visible: true
    }
  ])


  // View V-Logistique


  /**
   * View Stock vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.VLO.BICYCLE_STOCK,
      text: 'Vélo bénéficiaire',
      table_id: TABLES.VLO.STOCK_BIKE.ID
    }
  ])
  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.TYPE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.REF,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.BRAND,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.REQUEST,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.MAINTENANCE_DATE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.COMMISSIONING_DATE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.PERSON,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.PROVIDER,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.TRACER,
      table_view_id: VIEWS.VLO.BICYCLE_STOCK,
      visible: true
    }, {
      table_column_id: TABLES.VLO.STOCK_BIKE.COLUMNS.LAST_TRACER_DATA,
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
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.SOCIETY,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.USER,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.EMAIL,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.PHONE,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.ADDRESS,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.LOT,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.APE,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VAE,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_TRI,
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
      table_id: TABLES.VLO.LIST_RECIPIENT.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.SOCIETY,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.USER,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.STATUS,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.EMAIL,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.PHONE,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.ADDRESS,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.LOT,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.APE,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VAE,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_BI,
      table_view_id: VIEWS.VLO.RECIPIENT,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_TRI,
      table_view_id: VIEWS.VLO.PRE_RECIPIENT,
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
      table_id: TABLES.VLO.ROZO_REQUEST.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.VLO.ROZO_REQUEST.COLUMNS.NAME,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.ROZO_REQUEST.COLUMNS.TYPE,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.ROZO_REQUEST.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.ROZO_REQUEST.COLUMNS.DATE_REQUEST,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.ROZO_REQUEST.COLUMNS.STEP,
      table_view_id: VIEWS.VLO.ROZO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.ROZO_REQUEST.COLUMNS.STATUS,
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
      table_id: TABLES.VLO.LIST_PROVIDER.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.VLO.LIST_PROVIDER.COLUMNS.NAME,
      table_view_id: VIEWS.VLO.PROVIDER,
      visible: true
    }, {
      table_column_id: TABLES.VLO.LIST_PROVIDER.COLUMNS.USER,
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
      table_id: TABLES.VLO.MORIO.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.VLO.MORIO.COLUMNS.USER,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.MORIO.COLUMNS.TYPE,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.MORIO.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.MORIO.COLUMNS.REF,
      table_view_id: VIEWS.VLO.MORIO,
      visible: true
    }, {
      table_column_id: TABLES.VLO.MORIO.COLUMNS.STATUS,
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
      table_id: TABLES.VLO.FORMATION.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.VLO.FORMATION.COLUMNS.USER,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.VLO.FORMATION.COLUMNS.FILE,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.VLO.FORMATION.COLUMNS.DATE,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.VLO.FORMATION.COLUMNS.RATING,
      table_view_id: VIEWS.VLO.FORMATION,
      visible: true
    }
  ])

  // View Rozo

  /**
   * Vue ensemble des dossiers
   */
  await knex('table_view').insert([
    {
      id: VIEWS.ROZO.FOLDER,
      text: 'Ensemble des dossiers',
      table_id: TABLES.ROZO.FOLDER.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.ROZO.FOLDER.COLUMNS.SOCIETY,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.FOLDER.COLUMNS.STATUS_PERSON,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.FOLDER.COLUMNS.STATUS_FOLDER,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.FOLDER.COLUMNS.NUM_REQUEST,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.FOLDER.COLUMNS.STEP,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.FOLDER.COLUMNS.STATUS_PROGRAM,
      table_view_id: VIEWS.ROZO.FOLDER,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.FOLDER.COLUMNS.NB_BIKE,
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
      text: 'Ensembledes vélo utilisés',
      table_id: TABLES.ROZO.BIKE.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.ROZO.BIKE.COLUMNS.SOCIETY,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.BIKE.COLUMNS.NB_BIKE,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.BIKE.COLUMNS.PERIOD,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.BIKE.COLUMNS.STATUS,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    }, {
      table_column_id: TABLES.ROZO.BIKE.COLUMNS.PROVIDER,
      table_view_id: VIEWS.ROZO.BIKE,
      visible: true
    }
  ])


  // View Morio


  /**
   * Vue ensemble des incidents de vélo
   */
  await knex('table_view').insert([
    {
      id: VIEWS.MORIO.INCIDENT,
      text: 'Ensemble des incidents de vélo',
      table_id: TABLES.MORIO.INCIDENT.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.MORIO.INCIDENT.COLUMNS.SOCIETY,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true
    }, {
      table_column_id: TABLES.MORIO.INCIDENT.COLUMNS.TYPE,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true
    }, {
      table_column_id: TABLES.MORIO.INCIDENT.COLUMNS.STATUS,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true
    }, {
      table_column_id: TABLES.MORIO.INCIDENT.COLUMNS.INCIDENT,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true
    }, {
      table_column_id: TABLES.MORIO.INCIDENT.COLUMNS.DATE,
      table_view_id: VIEWS.MORIO.INCIDENT,
      visible: true
    }
  ])

  /**
   * Vue ensemble des traceurs
   */
  await knex('table_view').insert([
    {
      id: VIEWS.MORIO.TRACER,
      text: 'Ensemble des traceurs',
      table_id: TABLES.MORIO.TRACER.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.MORIO.TRACER.COLUMNS.SOCIETY,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true
    }, {
      table_column_id: TABLES.MORIO.TRACER.COLUMNS.TYPE,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true
    }, {
      table_column_id: TABLES.MORIO.TRACER.COLUMNS.STATUS,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true
    }, {
      table_column_id: TABLES.MORIO.TRACER.COLUMNS.TRACER,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true
    }, {
      table_column_id: TABLES.MORIO.TRACER.COLUMNS.DATE_BEGIN,
      table_view_id: VIEWS.MORIO.TRACER,
      visible: true
    }
  ])


  // View Fub

  /**
   * Vue ensemble des formations
   */
  await knex('table_view').insert([
    {
      id: VIEWS.FUB.FORMATION,
      text: 'Ensemble des formations',
      table_id: TABLES.FUB.FORMATION.ID
    }
  ])

  await knex('table_view_has_table_column').insert([
    {
      table_column_id: TABLES.FUB.FORMATION.COLUMNS.SOCIETY,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.FUB.FORMATION.COLUMNS.TYPE,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.FUB.FORMATION.COLUMNS.FORMATION,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true
    }, {
      table_column_id: TABLES.FUB.FORMATION.COLUMNS.DATE,
      table_view_id: VIEWS.FUB.FORMATION,
      visible: true
    }
  ])

}
