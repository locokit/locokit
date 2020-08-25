import * as Knex from 'knex'
import { glossary } from '../../core/15-glossary'
import { WORKSPACE } from './150-v-logistique-chapters'
import { DATABASE, TABLES } from '../../../src/glossary-seed/schema-glossary'

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

  /**
   * Table demande
   */
  await knex("table").insert([
    {
      id: TABLES.REQUEST.ID,
      text: 'Demande',
      database_id: DATABASE
    }
  ])
  await knex("table_column").insert([
    {
      id: TABLES.REQUEST.COLUMNS.PERSON,
      text: 'Personne à l\'origine de la demande',
      table_id: TABLES.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      settings: {
        tableId: TABLES.VLO.LIST_PRE_RECIPIENT.ID //TODO
      }
    }, {
      id: TABLES.REQUEST.COLUMNS.CREATION_DATE,
      text: 'Date de la demande',
      table_id: TABLES.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.REQUEST.COLUMNS.NB_VAE,
      text: 'Nombre de VAE',
      table_id: TABLES.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }, {
      id: TABLES.REQUEST.COLUMNS.NB_VCAE_BI,
      text: 'Nombre de VCAE Bi-porteur',
      table_id: TABLES.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }, {
      id: TABLES.REQUEST.COLUMNS.NB_VCAE_TRI,
      text: 'Nombre de VAE Tri-porteur',
      table_id: TABLES.REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
    }
  ])


  // View Fournisseur


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
      column_type_id: glossary.COLUMN_TYPE.STRING
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
        values: {
          1: {
            label: 'En maintenance',
            color: '#ef1'
          },
          2: {
            label: 'En utilisation',
            color: '#ef1'
          },
          3: {
            label: 'Stocké',
            color: '#ef1'
          }
        }
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
        tableId: TABLES.VLO.LIST_PRE_RECIPIENT.ID //TODO
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
      column_type_id: glossary.COLUMN_TYPE.STRING
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
        values: {
          1: {
            label: 'En maintenance',
            color: '#ef1'
          },
          2: {
            label: 'En utilisation',
            color: '#ef1'
          },
          3: {
            label: 'Stocké',
            color: '#ef1'
          }
        }
      }
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.RECIPIENT,
      text: 'Bénéficiaire',
      table_id: TABLES.PROVIDER.MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.VLO.LIST_PRE_RECIPIENT.ID //TODO
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
        values: {
          1: {
            label: 'Maintenance 1',
            color: '#ef1'
          },
          2: {
            label: 'Maintenance 2',
            color: '#ef1'
          },
          3: {
            label: 'Maintenance 3',
            color: '#ef1'
          }
        }
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
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.PROVIDER.MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: {
          1: {
            label: 'En maintenance',
            color: '#ef1'
          },
          2: {
            label: 'En utilisation',
            color: '#ef1'
          },
          3: {
            label: 'Stocké',
            color: '#ef1'
          }
        }
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
        tableId: TABLES.VLO.LIST_PRE_RECIPIENT.ID //TODO
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
      column_type_id: glossary.COLUMN_TYPE.STRING
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
        values: {
          1: {
            label: 'En maintenance',
            color: '#ef1'
          },
          2: {
            label: 'En utilisation',
            color: '#ef1'
          },
          3: {
            label: 'Stocké',
            color: '#ef1'
          }
        }
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
        values: {
          1: {
            label: 'Ok',
            color: '#359320'
          },
          2: {
            label: 'Accident',
            color: '#cb4814'
          },
          3: {
            label: 'Vol',
            color: '#a5071e'
          }
        }
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
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.RECIPIENT.AWARENESS_FORMATION.COLUMNS.INSTITUTION,
      text: 'Organisme',
      table_id: TABLES.RECIPIENT.AWARENESS_FORMATION.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: {
          1: {
            label: 'FUB',
            color: '#ef1'
          },
          2: {
            label: 'BicyclAide',
            color: '#ef1'
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
      column_type_id: glossary.COLUMN_TYPE.STRING
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
        values: {
          [TABLES.VLO.STOCK_BIKE.DATA.STATUS_IN_MAINTENANCE]: {
            label: 'En maintenance',
            color: '#23547b',
            backgroundColor: '#b3e5fc'
          },
          [TABLES.VLO.STOCK_BIKE.DATA.STATUS_IN_USE]: {
            label: 'En utilisation',
            color: '#256029',
            backgroundColor: '#c8e6c9'
          },
          [TABLES.VLO.STOCK_BIKE.DATA.STATUS_STORED]: {
            label: 'Stocké',
            color: '#805b36',
            backgroundColor: '#ffd8b2'
          }
        }
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
        tableId: TABLES.VLO.LIST_PRE_RECIPIENT.ID //Todo
      }
    }, {
      id: TABLES.VLO.STOCK_BIKE.COLUMNS.PROVIDER,
      text: 'Fournisseur',
      table_id: TABLES.VLO.STOCK_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER
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
        values: {
          1: {
            label: 'Non éligible',
            color: '#c63737'
          },
          2: {
            label: 'Éligible',
            color: '#256029'
          },
          3: {
            label: 'En étude',
            color: '#23547b'
          }
        }
      }
    }, {
      id: TABLES.VLO.LIST_PRE_RECIPIENT.COLUMNS.NUM_REQUEST,
      text: 'Numéro demande',
      table_id: TABLES.VLO.LIST_PRE_RECIPIENT.ID,
      column_type_id: glossary.COLUMN_TYPE.NUMBER
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
        values: {
          1: {
            label: 'Lot 1',
            color: '#b1492f'
          },
          2: {
            label: 'Lot 2',
            color: '#598916'
          },
          3: {
            label: 'Lot 3',
            color: '#25496a'
          },
        }
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
      // column_type_id: glossary.COLUMN_TYPE.USER // Todo
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
        values: {
          1: {
            label: 'En utilisation',
            color: '#359320'
          },
          2: {
            label: 'En maintenance',
            color: '#cb4814'
          },
          3: {
            label: 'En commande',
            color: '#a5071e'
          }
        }
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
        values: {
          1: {
            label: 'Lot 1',
            color: '#b1492f'
          },
          2: {
            label: 'Lot 2',
            color: '#598916'
          },
          3: {
            label: 'Lot 3',
            color: '#25496a'
          },
        }
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
        tableId: TABLES.VLO.LIST_PRE_RECIPIENT.ID //TODO
      }
    }, {
      id: TABLES.VLO.ROZO_REQUEST.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.VLO.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.GROUP,
      settings: {
        tableId: TABLES.VLO.LIST_PRE_RECIPIENT.ID //TODO
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
        values: {
          1: {
            label: 'Premier contact',
            color: '#ef1'
          },
          2: {
            label: 'Questionnaire',
            color: '#ef1'
          },
          3: {
            label: 'Entretien téléphonique',
            color: '#ef1'
          },
          4: {
            label: 'Commande vélo&co',
            color: '#ef1'
          },
          5: {
            label: 'Livré',
            color: '#ef1'
          }
        }
      }
    }, {
      id: TABLES.VLO.ROZO_REQUEST.COLUMNS.STATUS,
      text: 'État',
      table_id: TABLES.VLO.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
      settings: {
        values: {
          1: {
            label: 'À faire',
            color: '#ef1'
          },
          2: {
            label: 'En cours',
            color: '#ef1'
          },
          3: {
            label: 'Fait',
            color: '#ef1'
          }
        }
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
    column_type_id: glossary.COLUMN_TYPE.STRING
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
      values: {
        1: {
          label: 'Livré',
          color: '#ef1'
        },
        2: {
          label: 'En cours de livraison',
          color: '#ef1'
        },
        3: {
          label: 'Préparation de l\'envoi',
          color: '#ef1'
        },
        4: {
          label: 'Non traité',
          color: '#ef1'
        },
      }
    }
  }])

}
