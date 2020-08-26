import * as Knex from 'knex'
import { glossary } from '../../core/15-glossary'
import { WORKSPACE } from './150-v-logistique-chapters'
import { DATABASE, TABLES } from '../../../src/glossary-seed/schema-glossary'
import { VALUES } from '../../../src/glossary-seed/value_single_select-glossary'

//TODO: Difference between User and RELATION_BETWEEN_TABLES ?
// column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
//   settings: {
//   table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID
// }

export async function seed (knex: Knex): Promise<any> {
  /**
   * Database
   */
  await knex('database').insert([
    {
      id: DATABASE,
      text: 'Base principale',
      workspace_id: WORKSPACE
    }
  ])

  /**
   * Tables
   */

  /**
   * Table Traceurs Morio
   */
  await knex("table").insert([
    {
      id: TABLES.MORIO_TRACER.ID,
      text: 'Traceurs Morio',
      database_id: DATABASE
    }, {
      id: TABLES.MORIO_TRACER_DATA.ID,
      text: 'Métriques traceurs Morio',
      database_id: DATABASE
    }
  ])

  await knex("table_column").insert([
    {
      id: TABLES.MORIO_TRACER.COLUMNS.REF,
      text: 'Référence',
      table_id: TABLES.MORIO_TRACER.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.MORIO_TRACER.COLUMNS.STATUS,
      text: 'Statut',
      table_id: TABLES.MORIO_TRACER.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: {
          [TABLES.MORIO_TRACER.DATA.STATUS_STOLEN]: {
            label: 'Volé',
            color: '#c63737',
            backgroundColor: '#ffcdd2'
          },
          [TABLES.MORIO_TRACER.DATA.STATUS_INPROGRESS]: {
            label: 'En cours de montage',
            color: '#23547b',
            backgroundColor: '#b3e5fc'
          },
          [TABLES.MORIO_TRACER.DATA.STATUS_WORKING]: {
            label: 'Fonctionnel',
            color: '#256029',
            backgroundColor: '#c8e6c9'
          },
        }
      }
    }, {
      id: TABLES.MORIO_TRACER_DATA.COLUMNS.REF,
      text: 'Référence',
      table_id: TABLES.MORIO_TRACER_DATA.ID,
      column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      settings: {
        tableId: TABLES.MORIO_TRACER.ID
      }
    }, {
      id: TABLES.MORIO_TRACER_DATA.COLUMNS.BEGIN,
      text: 'Début de période',
      table_id: TABLES.MORIO_TRACER_DATA.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.MORIO_TRACER_DATA.COLUMNS.END,
      text: 'Fin de période',
      table_id: TABLES.MORIO_TRACER_DATA.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.MORIO_TRACER_DATA.COLUMNS.VALUE,
      text: 'Valeur',
      table_id: TABLES.MORIO_TRACER_DATA.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }
  ])


  // View Fournisseur

  /**
   * Table demande
   */
  await knex("table").insert([
    {
      id: TABLES.PROVIDER.REQUEST.ID,
      text: 'Demande',
      database_id: DATABASE
    }
  ])
  await knex("table_column").insert([{
      id: TABLES.PROVIDER.REQUEST.COLUMNS.SOCIETY,
      text: 'Société',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING,
    }, {
      id: TABLES.PROVIDER.REQUEST.COLUMNS.PERSON,
      text: 'Référent',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING,
  }, {
      id: TABLES.PROVIDER.REQUEST.COLUMNS.STATUS,
      text: 'Statut',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.ELIGIBILITY
      }
    }, {
      id: TABLES.PROVIDER.REQUEST.COLUMNS.NUM_REQUEST,
      text: 'Numéro demande',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    },  {
      id: TABLES.PROVIDER.REQUEST.COLUMNS.ADDRESS,
      text: 'Adresse',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    },  {
      id: TABLES.PROVIDER.REQUEST.COLUMNS.LOT,
      text: 'Lot',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.LOT
      }
    }, {
      id: TABLES.PROVIDER.REQUEST.COLUMNS.NB_VAE,
      text: 'Nombre de VAE',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }, {
      id: TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_BI,
      text: 'Nombre de VCAE Bi-porteur',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }, {
      id: TABLES.PROVIDER.REQUEST.COLUMNS.NB_VCAE_TRI,
      text: 'Nombre de VAE Tri-porteur',
      table_id: TABLES.PROVIDER.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }
  ])

  /**
   * Table FLEET BIKE
   */
  await knex('table').insert([
    {
      id: TABLES.PROVIDER.FLEET_BIKE.ID,
      text: 'Flotte de vélos',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.BIKE
      }
    }, {
      id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.BRAND,
      text: 'Marque',
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.USE
      }
    }, {
      id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Dernier entretien',
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      text: 'Mise en service',
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.PROVIDER,
      text: 'Prestataire',
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER.FLEET_BIKE.COLUMNS.RECIPIENT,
      text: 'Bénéficiaire',
      table_id: TABLES.PROVIDER.FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        table_id: TABLES.VLO.LIST_PROVIDER.ID
      }
    }
  ])

  /**
   * Table Maintenance preventive BIKE
   */
  await knex('table').insert([
    {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      text: 'Maintenance préventive',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.BIKE
      }
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.USE
      }
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.RECIPIENT,
      text: 'Bénéficiaire',
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.VLO.LIST_RECIPIENT.ID
      }
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Dernier entretien',
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TECHNICIAN,
      text: 'Technicien',
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING,
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_STEP,
      text: 'Étape maintenance',
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.MAINTENANCE
      }
    }
  ])


  /**
   * Table Maintenance curative BIKE
   */
  await knex('table').insert([
    {
      id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
      text: 'Maintenace curative',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.BIKE
      }
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.INCIDENT,
      text: 'Incident',
      table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.INCIDENT
      }
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Date',
      table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.RECIPIENT,
      text: 'Bénéficiaire',
      table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.VLO.LIST_RECIPIENT.ID
      }
    }
  ])


  // View Bénéficiare

  /**
   * Table Usage vélo
   */
  await knex('table').insert([
    {
      id: TABLES.RECIPIENT.USING_BIKE.ID,
      text: 'Usag Vélo',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.BIKE
      }
    }, {
      id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.USE
      }
    }, {
      id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.BRAND,
      text: 'Marque',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.COMMISSIONING_DATE,
      text: 'Mise en service',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Dernier entretien',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.LAST_TRACER_DATA,
      text: 'Derniers kms',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN
    }, {
      id: TABLES.RECIPIENT.USING_BIKE.COLUMNS.ALERT,
      text: 'Alerte',
      table_id: TABLES.RECIPIENT.USING_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.INCIDENT
      }
    }
  ])

  /**
   * Table Sensibilisation et Formation
   */
  await knex('table').insert([
    {
      id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID,
      text: 'Formation',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.BIKE
      }
    }, {
      id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.INSTITUTION,
      text: 'Organisme',
      table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: {
          1: {
            label: 'FUB',
            color: '#25496a'
          },
          2: {
            label: 'BicyclAide',
            color: '#082b4b'
          }
        }
      }
    }, {
      id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.TRAINER,
      text: 'Formateur',
      table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.FILE,
      text: 'Pièce jointe',
      table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.DATE,
      text: 'Date',
      table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }
  ])

  // View V-Logistique

  /**
   * Table Vélo
   */
  await knex("table").insert([
    {
      id: TABLES.VLO.STOCK_BIKE.ID,
      text: 'Stock Vélo',
      database_id: DATABASE
    }
  ])
  await knex("table_column").insert([
    {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.BIKE
      }
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.REF,
      text: 'Identité',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: 9,
      settings: {
        values: VALUES.USE
      },
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.BRAND,
      text: 'Marque',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.REQUEST,
      text: 'Demande corrélée',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING,
    // }, {
    //   id: TABLES.VLO.STOCK_BIKE.COLUMNS.REQUEST,
    //   text: 'Demande corrélée',
    //   table_id: TABLES.VLO.STOCK_BIKE.ID,
    //   column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    //   settings: {
    //     tableId: TABLES.REQUEST.ID
    //   }
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Entretien',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.COMMISSIONING_DATE,
      text: 'Mise en service',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      text: 'Date de livraison prévue',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.PERSON,
      text: 'Bénéficiaire',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.VLO.LIST_RECIPIENT.ID
      }
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.PROVIDER,
      text: 'Fournisseur',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.LOT,
      text: 'Lot',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.LOT
      }
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.TRACER,
      text: 'Traceur',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.LAST_TRACER_DATA,
      text: 'Derniers kms',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN
    }
  ])

  /**
   * Table Pré-Bénéficiare
   */
  await knex("table").insert([
    {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      text: 'Pré-Bénéficiare',
      database_id: DATABASE
    }
  ])
  await knex("table_column").insert([
    {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.SOCIETY,
      text: 'Entreprise',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      // column_type_id: glossary.COLUMN_TYPE.USER
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.USER,
      text: 'Référent',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      // column_type_id: glossary.COLUMN_TYPE.USER
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.STATUS,
      text: 'Statut',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.ELIGIBILITY
      }
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NUM_REQUEST,
      text: 'Numéro demande',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.EMAIL,
      text: 'Email',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.PHONE,
      text: 'Adresse',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.ADDRESS,
      text: 'Code APE',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.LOT,
      text: 'Lot',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.LOT
      }
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.APE,
      text: 'Code APE',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VAE,
      text: 'VAE',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_BI,
      text: 'VCAE BI',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NB_VCAE_TRI,
      text: 'VCAE TRI',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }
  ])

  /**
   * Table Bénéficiare
   */
  await knex("table").insert([
    {
      id: TABLES.VLO.LIST_RECIPIENT.ID,
      text: 'Bénéficiare',
      database_id: DATABASE
    }
  ])
  await knex("table_column").insert([
    {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.SOCIETY,
      text: 'Entreprise',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      // column_type_id: glossary.COLUMN_TYPE.USER // Todo when data society available
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.USER,
      text: 'Référent',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.USER
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.STATUS,
      text: 'Statut flotte',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.USE
      }
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NUM_REQUEST,
      text: 'Numéro demande',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.EMAIL,
      text: 'Email',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.PHONE,
      text: 'Adresse',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.ADDRESS,
      text: 'Code APE',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.LOT,
      text: 'Lot',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.LOT
      }
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.APE,
      text: 'Code APE',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VAE,
      text: 'VAE',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_BI,
      text: 'VCAE BI',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }, {
      id: TABLES.VLO.LIST_RECIPIENT.COLUMNS.NB_VCAE_TRI,
      text: 'VCAE TRI',
      table_id: TABLES.VLO.LIST_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }
  ])

  /**
   * Table Rozo
   */
  await knex('table').insert([
    {
      id: TABLES.VLO.ROZO_REQUEST.ID,
      text: 'Rozo',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.VLO.ROZO_REQUEST.COLUMNS.NAME,
      text: 'Bénéficiaire',
      table_id: TABLES.VLO.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.VLO.LIST_RECIPIENT.ID
      }
    }, {
      id: TABLES.VLO.ROZO_REQUEST.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.VLO.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.GROUP,
      settings: {
        tableId: TABLES.VLO.LIST_RECIPIENT.ID
      }
    }, {
      id: TABLES.VLO.ROZO_REQUEST.COLUMNS.NUM_REQUEST,
      text: 'Numéro de demande',
      table_id: TABLES.VLO.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING,
    }, {
      id: TABLES.VLO.ROZO_REQUEST.COLUMNS.DATE_REQUEST,
      text: 'Date de demande',
      table_id: TABLES.VLO.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.VLO.ROZO_REQUEST.COLUMNS.STEP,
      text: 'Étape programme',
      table_id: TABLES.VLO.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.QUESTIONNARY
      }
    }, {
      id: TABLES.VLO.ROZO_REQUEST.COLUMNS.STATUS,
      text: 'État',
      table_id: TABLES.VLO.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: VALUES.KANBAN
      }
    },
  ])

  /**
   * Table Fournisseur
   */

  await knex("table").insert([{
    id: TABLES.VLO.LIST_PROVIDER.ID,
    text: 'Fournisseur',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.VLO.LIST_PROVIDER.COLUMNS.NAME,
    text: 'Nom fournisseur',
    table_id: TABLES.VLO.LIST_PROVIDER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.VLO.LIST_PROVIDER.COLUMNS.USER,
    text: 'Utilisateur corrélé',
    table_id: TABLES.VLO.LIST_PROVIDER.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }])

  /**
   * Table Morio
   */

  await knex("table").insert([{
    id: TABLES.VLO.MORIO.ID,
    text: 'Morio',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.VLO.MORIO.COLUMNS.USER,
    text: 'Bénéficiaire',
    table_id: TABLES.VLO.MORIO.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  },{
    id: TABLES.VLO.MORIO.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.VLO.MORIO.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.BIKE
    }
  },{
    id: TABLES.VLO.MORIO.COLUMNS.NUM_REQUEST,
    text: 'Numéro demande',
    table_id: TABLES.VLO.MORIO.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  },{
    id: TABLES.VLO.MORIO.COLUMNS.NUM_TRACER,
    text: 'Numéro traceur',
    table_id: TABLES.VLO.MORIO.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  },{
    id: TABLES.VLO.MORIO.COLUMNS.STATUS,
    text: 'Statut',
    table_id: TABLES.VLO.MORIO.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.SHIPMENT
    }
  }])

  /**
   * Table Formations
   */

  await knex("table").insert([{
    id: TABLES.VLO.FORMATION.ID,
    text: 'Formations et Assistances',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.VLO.FORMATION.COLUMNS.USER,
    text: 'Bénéficiaire',
    table_id: TABLES.VLO.FORMATION.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  },{
    id: TABLES.VLO.FORMATION.COLUMNS.FILE,
    text: 'Document',
    table_id: TABLES.VLO.FORMATION.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  },{
    id: TABLES.VLO.FORMATION.COLUMNS.DATE,
    text: 'Date',
    table_id: TABLES.VLO.FORMATION.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  },{
    id: TABLES.VLO.FORMATION.COLUMNS.RATING,
    text: 'Évaluation',
    table_id: TABLES.VLO.FORMATION.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.RATING
    }
  }])

  // View Rozo

  /**
   * Table Dossiers en instruction
   */

  await knex("table").insert([{
    id: TABLES.ROZO.FOLDER.ID,
    text: 'Dossiers en instruction',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.ROZO.FOLDER.COLUMNS.SOCIETY,
    text: 'Entreprise',
    table_id: TABLES.ROZO.FOLDER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.ROZO.FOLDER.COLUMNS.STATUS_PERSON,
    text: 'Type',
    table_id: TABLES.ROZO.FOLDER.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.USER_STATUS
    }
  }, {
    id: TABLES.ROZO.FOLDER.COLUMNS.STATUS_FOLDER,
    text: 'Statut',
    table_id: TABLES.ROZO.FOLDER.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.ELIGIBILITY
    }
  }, {
    id: TABLES.ROZO.FOLDER.COLUMNS.NUM_REQUEST,
    text: 'Numéro demande',
    table_id: TABLES.ROZO.FOLDER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.ROZO.FOLDER.COLUMNS.STEP,
    text: 'Étape programme',
    table_id: TABLES.ROZO.FOLDER.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.QUESTIONNARY
    }
  }, {
    id: TABLES.ROZO.FOLDER.COLUMNS.STATUS_PROGRAM,
    text: 'État étape',
    table_id: TABLES.ROZO.FOLDER.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.KANBAN
    }
  }, {
    id: TABLES.ROZO.FOLDER.COLUMNS.NB_BIKE,
    text: 'Vélo',
    table_id: TABLES.ROZO.FOLDER.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }])

  /**
   * Table Utilisation vélo
   */

  await knex("table").insert([{
    id: TABLES.ROZO.BIKE.ID,
    text: 'Vélos par entreprise',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.ROZO.BIKE.COLUMNS.SOCIETY,
    text: 'Entreprise',
    table_id: TABLES.ROZO.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.ROZO.BIKE.COLUMNS.NB_BIKE,
    text: 'Nombre vélo',
    table_id: TABLES.ROZO.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }, {
    id: TABLES.ROZO.BIKE.COLUMNS.PERIOD,
    text: 'Km/sem',
    table_id: TABLES.ROZO.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }, {
    id: TABLES.ROZO.BIKE.COLUMNS.STATUS,
    text: 'État flotte',
    table_id: TABLES.ROZO.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.USE
    }
  }, {
    id: TABLES.ROZO.BIKE.COLUMNS.PROVIDER,
    text: 'Fournisseur',
    table_id: TABLES.ROZO.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }])

  // View Morio

  /**
   * Table Incident vélo
   */

  await knex("table").insert([{
    id: TABLES.MORIO.INCIDENT.ID,
    text: 'Incident',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.MORIO.INCIDENT.COLUMNS.SOCIETY,
    text: 'Bénéficiaire',
    table_id: TABLES.MORIO.INCIDENT.ID,
    // column_type_id: glossary.COLUMN_TYPE.USER // Todo when data society available
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MORIO.INCIDENT.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.MORIO.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.BIKE
    }
  }, {
    id: TABLES.MORIO.INCIDENT.COLUMNS.STATUS,
    text: 'Statut',
    table_id: TABLES.MORIO.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.USE
    }
  }, {
    id: TABLES.MORIO.INCIDENT.COLUMNS.INCIDENT,
    text: 'Incident',
    table_id: TABLES.MORIO.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.INCIDENT
    }
  }, {
    id: TABLES.MORIO.INCIDENT.COLUMNS.DATE,
    text: 'Date',
    table_id: TABLES.MORIO.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }])

  /**
   * Table Traceur vélo
   */

  await knex("table").insert([{
    id: TABLES.MORIO.TRACER.ID,
    text: 'Traceur',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.MORIO.TRACER.COLUMNS.SOCIETY,
    text: 'Bénéficiaire',
    table_id: TABLES.MORIO.TRACER.ID,
    // column_type_id: glossary.COLUMN_TYPE.USER // Todo when data society available
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MORIO.TRACER.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.MORIO.TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.BIKE
    }
  }, {
    id: TABLES.MORIO.TRACER.COLUMNS.STATUS,
    text: 'Statut',
    table_id: TABLES.MORIO.TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.USE
    }
  }, {
    id: TABLES.MORIO.TRACER.COLUMNS.TRACER,
    text: 'Traceur',
    table_id: TABLES.MORIO.TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MORIO.TRACER.COLUMNS.DATE_BEGIN,
    text: 'Début programme',
    table_id: TABLES.MORIO.TRACER.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }])


  // View Fub

  /**
   * Table Formation vélo
   */

  await knex("table").insert([{
    id: TABLES.FUB.FORMATION.ID,
    text: 'Formation',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.FUB.FORMATION.COLUMNS.SOCIETY,
    text: 'Bénéficiaire',
    table_id: TABLES.FUB.FORMATION.ID,
    // column_type_id: glossary.COLUMN_TYPE.USER // Todo when data society available
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.FUB.FORMATION.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.FUB.FORMATION.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.KANBAN
    }
  }, {
    id: TABLES.FUB.FORMATION.COLUMNS.FORMATION,
    text: 'Formation',
    table_id: TABLES.FUB.FORMATION.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.BIKE
    }
  }, {
    id: TABLES.FUB.FORMATION.COLUMNS.DATE,
    text: 'Date',
    table_id: TABLES.FUB.FORMATION.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }])
}
