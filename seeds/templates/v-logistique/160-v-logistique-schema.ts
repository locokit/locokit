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
            label: 'VOLÉ',
            color: '#c63737',
            backgroundColor: '#ffcdd2'
          },
          [TABLES.MORIO_TRACER.DATA.STATUS_INPROGRESS]: {
            label: 'EN COURS DE MONTAGE',
            color: '#23547b',
            backgroundColor: '#b3e5fc'
          },
          [TABLES.MORIO_TRACER.DATA.STATUS_WORKING]: {
            label: 'FONCTIONNEL',
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
   * Table Personne
   */
  await knex("table").insert([
    {
      id: TABLES.PERSON.ID,
      text: 'Personne',
      database_id: DATABASE
    }
  ])
  await knex("table_column").insert([
    {
      id: TABLES.PERSON.COLUMNS.LASTNAME,
      text: 'Nom',
      table_id: TABLES.PERSON.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PERSON.COLUMNS.FIRSTNAME,
      text: 'Prénom',
      table_id: TABLES.PERSON.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PERSON.COLUMNS.USER,
      text: 'Utilisateur corrélé',
      table_id: TABLES.PERSON.ID,
      column_type_id: glossary.COLUMN_TYPE.USER
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
        tableId: TABLES.PERSON.ID
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
      id: TABLES.PROVIDER_FLEET_BIKE.ID,
      text: 'Vélos',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.BRAND,
      text: 'Marque',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
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
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Dernier entretien',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
      text: 'Mise en service',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.PROVIDER,
      text: 'Prestataire',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_FLEET_BIKE.COLUMNS.RECIPIENT,
      text: 'Bénéficiaire',
      table_id: TABLES.PROVIDER_FLEET_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }
  ])

  /**
   * Table Maintenance preventive BIKE
   */
  await knex('table').insert([
    {
      id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
      text: 'Vélos',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
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
      id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.RECIPIENT,
      text: 'Bénéficiaire',
      table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }, {
      id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Dernier entretien',
      table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.TECHNICIAN,
      text: 'Technicien',
      table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING,
    }, {
      id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.COLUMNS.MAINTENANCE_STEP,
      text: 'Étape maintenance',
      table_id: TABLES.PROVIDER_MAINTENANCE_PREVENTIVE_BIKE.ID,
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
      id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.ID,
      text: 'Vélos',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.ID,
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
      id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.MAINTENANCE_DATE,
      text: 'Date',
      table_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.COLUMNS.RECIPIENT,
      text: 'Bénéficiaire',
      table_id: TABLES.PROVIDER_MAINTENANCE_CURATIVE_BIKE.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }
  ])


  // View Bénéficiare

  /**
   * Table Usage vélo
   */
  await knex('table').insert([
    {
      id: TABLES.BENEFICIAIRE_BICYCLE.ID,
      text: 'Vélo',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.IDENTITY,
      text: 'Identité',
      table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
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
      id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.BRAND,
      text: 'Marque',
      table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.COMMISSIONING_DATE,
      text: 'Mise en service',
      table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.MAINTENANCE_DATE,
      text: 'Dernier entretien',
      table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.LAST_TRACER_DATA,
      text: 'Derniers kms',
      table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
      column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN
    }, {
      id: TABLES.BENEFICIAIRE_BICYCLE.COLUMNS.ALERT,
      text: 'Alerte',
      table_id: TABLES.BENEFICIAIRE_BICYCLE.ID,
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

  // View V-Logistique

  /**
   * Table Vélo
   */
  await knex("table").insert([
    {
      id: TABLES.VLO_STOCK_1.ID,
      text: 'Vélo',
      database_id: DATABASE
    }
  ])
  await knex("table_column").insert([
    {
      id: TABLES.VLO_STOCK_1.COLUMNS.NAME,
      text: 'Nom du vélo',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.REF,
      text: 'Identité',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.STATUS,
      text: 'État du vélo',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: 9,
      settings: {
        values: {
          [TABLES.VLO_STOCK_1.DATA.STATUS_IN_MAINTENANCE]: {
            label: 'En maintenance',
            color: '#23547b',
            backgroundColor: '#b3e5fc'
          },
          [TABLES.VLO_STOCK_1.DATA.STATUS_IN_USE]: {
            label: 'En utilisation',
            color: '#256029',
            backgroundColor: '#c8e6c9'
          },
          [TABLES.VLO_STOCK_1.DATA.STATUS_STORED]: {
            label: 'Stocké',
            color: '#805b36',
            backgroundColor: '#ffd8b2'
          }
        }
      },
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.BRAND,
      text: 'Marque',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.MAINTENANCE_DATE,
      text: 'Entretien',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.COMMISSIONING_DATE,
      text: 'Mise en service',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.DELIVERY_ESTIMATED_DATE,
      text: 'Date de livraison prévue',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.PERSON,
      text: 'Bénéficiaire',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.PROVIDER,
      text: 'Fournisseur',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.USER
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.TRACER,
      text: 'Traceur',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.LAST_TRACER_DATA,
      text: 'Derniers kms',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN
    }, {
      id: TABLES.VLO_STOCK_1.COLUMNS.REQUEST,
      text: 'Demande corrélée',
      table_id: TABLES.VLO_STOCK_1.ID,
      column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      settings: {
        tableId: TABLES.REQUEST.ID
      }
    }
  ])

  /**
   * Table Stock Fournisseur
   */

  await knex("table").insert([{
    id: TABLES.VLO_STOCK_2.ID,
    text: 'Fournisseur',
    database_id: DATABASE
  }])
  await knex("table_column").insert([{
    id: TABLES.VLO_STOCK_2.COLUMNS.NAME,
    text: 'Nom fournisseur',
    table_id: TABLES.VLO_STOCK_2.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.VLO_STOCK_2.COLUMNS.USER,
    text: 'Utilisateur corrélé',
    table_id: TABLES.VLO_STOCK_2.ID,
    column_type_id: glossary.COLUMN_TYPE.USER
  }])

  /**
   * Table Rozo
   */
  await knex('table').insert([
    {
      id: TABLES.ROZO_REQUEST.ID,
      text: 'Rozo',
      database_id: DATABASE
    }
  ])
  await knex('table_column').insert([
    {
      id: TABLES.ROZO_REQUEST.COLUMNS.NAME,
      text: 'Bénéficiaire',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.USER,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.TYPE,
      text: 'Type',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.GROUP,
      settings: {
        tableId: TABLES.PERSON.ID
      }
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.NUM_DEMAND,
      text: 'Numéro de demande',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.STRING,
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.DATE_DEMAND,
      text: 'Date de demande',
      table_id: TABLES.ROZO_REQUEST.ID,
      column_type_id: glossary.COLUMN_TYPE.DATE,
    }, {
      id: TABLES.ROZO_REQUEST.COLUMNS.STEP,
      text: 'Étape programme',
      table_id: TABLES.ROZO_REQUEST.ID,
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
      id: TABLES.ROZO_REQUEST.COLUMNS.STATUS,
      text: 'État',
      table_id: TABLES.ROZO_REQUEST.ID,
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
}
