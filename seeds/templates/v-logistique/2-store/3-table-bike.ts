import * as Knex from 'knex'
import { glossary } from '../../../core/glossary'
import { DATABASE_ID, TABLES } from '../glossary/schema'
import { VALUES } from '../glossary/value_single_select'

export async function seed (knex: Knex): Promise<any> {
  // Request
  await knex('table').insert([
    {
      id: TABLES.REQUEST.ID,
      text: 'Demande',
      database_id: DATABASE_ID
    }
  ])
  await knex('table_column').insert([{
    id: TABLES.REQUEST.COLUMNS.NUM_REQUEST,
    text: 'Numéro demande',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.REQUEST.COLUMNS.SOCIETY,
    text: 'Société',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.REQUEST.COLUMNS.BENEFICIARY,
    text: 'Bénéficiaire',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.PERSON.ID
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.BENEFICIARY_USER,
    text: 'Bénéficiaire Utilisateur',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.PERSON.ID,
      localField: TABLES.REQUEST.COLUMNS.BENEFICIARY,
      foreignField: TABLES.PERSON.COLUMNS.USER
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.SUPPLIER,
    text: 'Fournisseur',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.SUPPLIER.ID,
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.SUPPLIER_USER,
    text: 'Fournisseur Utilisateur',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.SUPPLIER.ID,
      localField: TABLES.REQUEST.COLUMNS.SUPPLIER,
      foreignField: TABLES.SUPPLIER.COLUMNS.USER
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.ADDRESS,
    text: 'Adresse',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.REQUEST.COLUMNS.CREATION_DATE,
    text: 'Date de création',
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
  }, {
    id: TABLES.REQUEST.COLUMNS.NB_BIKE,
    text: 'Nombre de vélos',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.NUMBER
  }, {
    id: TABLES.REQUEST.COLUMNS.STATUS,
    text: 'État',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.ELIGIBILITY
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.LOT,
    text: 'Lot',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.LOT
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.EMAIL,
    text: 'e-mail',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.REQUEST.COLUMNS.PHONE,
    text: 'Tél',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.REQUEST.COLUMNS.APE,
    text: 'Code APE',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.REQUEST.COLUMNS.NAME,
    text: 'Nom ?',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.REQUEST.COLUMNS.TYPE,
    text: 'Type ?',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.REQUEST.COLUMNS.STEP,
    text: 'Étape programme',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.QUESTIONNARY
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.STEP_STATUS,
    text: 'État étape',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.KANBAN
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.STATUS_PERSON,
    text: 'État référent',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.USER_STATUS
    }
  }, {
    id: TABLES.REQUEST.COLUMNS.STATUS_PROGRAM,
    text: 'État programme',
    table_id: TABLES.REQUEST.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }])

  // Bike type
  await knex('table').insert([
    {
      id: TABLES.BIKE_TYPE.ID,
      text: 'Type de vélo',
      database_id: DATABASE_ID
    }
  ])
  await knex('table_column').insert([{
    id: TABLES.BIKE_TYPE.COLUMNS.NAME,
    text: 'Nom',
    table_id: TABLES.BIKE_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.BIKE_TYPE.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.BIKE_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: {
        [TABLES.BIKE_TYPE.DATA.TYPE_VAE]: {
          label: 'VAE',
          color: '#c63737',
          backgroundColor: '#ffcdd2'
        },
        [TABLES.BIKE_TYPE.DATA.TYPE_VCAEBI]: {
          label: 'VCAE Bi',
          color: '#23547b',
          backgroundColor: '#b3e5fc'
        },
        [TABLES.BIKE_TYPE.DATA.TYPE_VCAETRI]: {
          label: 'VCAE Tri',
          color: '#256029',
          backgroundColor: '#c8e6c9'
        }
      }
    }
  }, {
    id: TABLES.BIKE_TYPE.COLUMNS.NEED_HELMET,
    text: 'Casque nécessaire',
    table_id: TABLES.BIKE_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.BOOLEAN
  }, {
    id: TABLES.BIKE_TYPE.COLUMNS.NEED_VEST,
    text: 'Gilet nécessaire',
    table_id: TABLES.BIKE_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.BOOLEAN
  }, {
    id: TABLES.BIKE_TYPE.COLUMNS.NEED_BAG,
    text: 'Sacoche nécessaire',
    table_id: TABLES.BIKE_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.BOOLEAN
  }, {
    id: TABLES.BIKE_TYPE.COLUMNS.BRAND,
    text: 'Nom',
    table_id: TABLES.BIKE_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }])


  // Bike type provider
  await knex('table').insert([
    {
      id: TABLES.BIKE_TYPE_SUPPLIER.ID,
      text: 'Fournisseurs de type de vélo',
      database_id: DATABASE_ID
    }
  ])
  await knex('table_column').insert([{
    id: TABLES.BIKE_TYPE_SUPPLIER.COLUMNS.BIKE_TYPE,
    text: 'Type de vélo',
    table_id: TABLES.BIKE_TYPE_SUPPLIER.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.BIKE_TYPE.ID
    }
  }, {
    id: TABLES.BIKE_TYPE_SUPPLIER.COLUMNS.SUPPLIER,
    text: 'Fournisseur',
    table_id: TABLES.BIKE_TYPE_SUPPLIER.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.SUPPLIER.ID
    }
  }])

  // Bike
  await knex('table').insert([
    {
      id: TABLES.BIKE.ID,
      text: 'Vélo',
      database_id: DATABASE_ID
    }
  ])
  await knex('table_column').insert([{
    id: TABLES.BIKE.COLUMNS.REF,
    text: 'Référence',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.BIKE.COLUMNS.TYPE,
    text: 'Type de vélo',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.BIKE_TYPE.ID
    }
  }, {
    id: TABLES.BIKE.COLUMNS.BRAND,
    text: 'Marque',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE_TYPE.ID,
      localField: TABLES.BIKE.COLUMNS.TYPE,
      foreignField: TABLES.BIKE_TYPE.COLUMNS.BRAND
    }
  }, {
    id: TABLES.BIKE.COLUMNS.STATUS,
    text: 'État',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: {
        [TABLES.BIKE.DATA.STATUS_STORED]: {
          label: 'Stocké',
          color: '#c63737',
          backgroundColor: '#ffcdd2'
        },
        [TABLES.BIKE.DATA.STATUS_IN_USE]: {
          label: 'En utilisation',
          color: '#23547b',
          backgroundColor: '#b3e5fc'
        },
        [TABLES.BIKE.DATA.STATUS_IN_MAINTENANCE]: {
          label: 'En maintenance',
          color: '#256029',
          backgroundColor: '#c8e6c9'
        }
      }
    }
  }, {
    id: TABLES.BIKE.COLUMNS.MAINTENANCE_DATE,
    text: 'Date de maintenance',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE,
    text: 'Date de livraison estimée',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.BIKE.COLUMNS.STARTING_DATE,
    text: 'Date de mise en service',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.BIKE.COLUMNS.SUPPLIER,
    text: 'Fournisseur',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.SUPPLIER.ID
    }
  }, {
    id: TABLES.BIKE.COLUMNS.SUPPLIER_USER,
    text: 'Fournisseur Utilisateur',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.SUPPLIER.ID,
      localField: TABLES.BIKE.COLUMNS.SUPPLIER,
      foreignField: TABLES.SUPPLIER.COLUMNS.USER
    }
  }, {
    id: TABLES.BIKE.COLUMNS.BENEFICIARY,
    text: 'Bénéficiaire',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.PERSON.ID
    }
  }, {
    id: TABLES.BIKE.COLUMNS.BENEFICIARY_USER,
    text: 'Bénéficiaire Utilisateur',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.PERSON.ID,
      localField: TABLES.BIKE.COLUMNS.BENEFICIARY,
      foreignField: TABLES.PERSON.COLUMNS.USER
    }
  }, {
    id: TABLES.BIKE.COLUMNS.TRACER,
    text: 'Traceur Morio',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.MORIO_TRACER.ID
    }
  }, {
    id: TABLES.BIKE.COLUMNS.LAST_TRACER_DATA,
    text: 'Dernière donnée kms',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.FORMULA,
    settings: {
      formula: {
        tableId: TABLES.MORIO_TRACER.ID,
        foreignField: TABLES.MORIO_TRACER_DATA.COLUMNS.VALUE,
        aggregate: 'avg',
        limit: 7,
        sort: TABLES.MORIO_TRACER_DATA.COLUMNS.END,
        order: 'DESC'
      }
    }
  }, {
    id: TABLES.BIKE.COLUMNS.ALERT,
    text: 'Alerte',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.BIKE.COLUMNS.PROVIDER,
    text: 'Prestataire',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.BIKE.COLUMNS.REQUEST,
    text: 'Demande',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.REQUEST.ID
    }
  }, {
    id: TABLES.BIKE.COLUMNS.NUM_REQUEST,
    text: 'Demande n°',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.REQUEST.ID,
      localField: TABLES.BIKE.COLUMNS.REQUEST,
      foreignField: TABLES.REQUEST.COLUMNS.NUM_REQUEST
    }
  }, {
    id: TABLES.BIKE.COLUMNS.LOT,
    text: 'Lot',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.REQUEST.ID,
      localField: TABLES.BIKE.COLUMNS.REQUEST,
      foreignField: TABLES.REQUEST.COLUMNS.LOT
    }
  }, {
    id: TABLES.BIKE.COLUMNS.SOCIETY,
    text: 'Société',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.REQUEST.ID,
      localField: TABLES.BIKE.COLUMNS.REQUEST,
      foreignField: TABLES.REQUEST.COLUMNS.SOCIETY
    }
  }, {
    id: TABLES.BIKE.COLUMNS.PERIOD,
    text: 'Période',
    table_id: TABLES.BIKE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }])

  // Gear type
  await knex('table').insert([{
    id: TABLES.GEAR_TYPE.ID,
    text: 'Type d\'accessoire',
    database_id: DATABASE_ID
  }])
  await knex('table_column').insert([{
    id: TABLES.GEAR_TYPE.COLUMNS.NAME,
    text: 'Nom',
    table_id: TABLES.GEAR_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.GEAR_TYPE.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.GEAR_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: {
        [TABLES.GEAR_TYPE.DATA.TYPE_BAG]: {
          label: 'Sacoche',
          color: '#c63737',
          backgroundColor: '#ffcdd2'
        },
        [TABLES.GEAR_TYPE.DATA.TYPE_HELMET]: {
          label: 'Casque',
          color: '#23547b',
          backgroundColor: '#b3e5fc'
        },
        [TABLES.GEAR_TYPE.DATA.TYPE_VEST]: {
          label: 'Gilet',
          color: '#256029',
          backgroundColor: '#c8e6c9'
        }
      }
    }
  }, {
    id: TABLES.GEAR_TYPE.COLUMNS.BRAND,
    text: 'Marque',
    table_id: TABLES.GEAR_TYPE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }])

  // Gear type provider
  await knex('table').insert([{
    id: TABLES.GEAR_TYPE_SUPPLIER.ID,
    text: 'Fournisseurs de type d\'accessoire',
    database_id: DATABASE_ID
  }])
  await knex('table_column').insert([{
    id: TABLES.GEAR_TYPE_SUPPLIER.COLUMNS.GEAR,
    text: 'Type d\'accessoire',
    table_id: TABLES.GEAR_TYPE_SUPPLIER.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.GEAR_TYPE.ID
    }
  }, {
    id: TABLES.GEAR_TYPE_SUPPLIER.COLUMNS.SUPPLIER,
    text: 'Fournisseur',
    table_id: TABLES.GEAR_TYPE_SUPPLIER.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.SUPPLIER.ID
    }
  }])

  // Gear
  await knex('table').insert([{
    id: TABLES.GEAR.ID,
    text: 'Accessoire',
    database_id: DATABASE_ID
  }])
  await knex('table_column').insert([{
    id: TABLES.GEAR.COLUMNS.REF,
    text: 'Nom',
    table_id: TABLES.GEAR.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.GEAR.COLUMNS.GEAR_TYPE,
    text: 'Type d\'accessoire',
    table_id: TABLES.GEAR.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.GEAR_TYPE.ID
    }
  }, {
    id: TABLES.GEAR.COLUMNS.SIZE,
    text: 'Taille',
    table_id: TABLES.GEAR.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.GEAR.COLUMNS.BIKE,
    text: 'Vélo',
    table_id: TABLES.GEAR.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.BIKE.ID
    }
  }])


  // Maintenance
  await knex('table').insert([{
    id: TABLES.MAINTENANCE.ID,
    text: 'Maintenance',
    database_id: DATABASE_ID
  }])
  await knex('table_column').insert([{
    id: TABLES.MAINTENANCE.COLUMNS.TYPE,
    text: 'Type',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.MAINTENANCE
    }
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.IDENTITY,
    text: 'Identité',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID,
      localField: TABLES.MAINTENANCE.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.REF
    }
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.SUPPLIER_USER,
    text: 'Fournisseur Utilisateur',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID,
      localField: TABLES.MAINTENANCE.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.SUPPLIER_USER
    }
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.BENEFICIARY_USER,
    text: 'Bénéficiaire Utilisateur',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID,
      localField: TABLES.MAINTENANCE.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.BENEFICIARY_USER
    }
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.STATUS,
    text: 'État',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.BENEFICIARY,
    text: 'Bénéficiaire',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID,
      localField: TABLES.MAINTENANCE.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.BENEFICIARY
    }
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE,
    text: 'Date de maintenance',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.TECHNICIAN,
    text: 'Technicien',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_STEP,
    text: 'Étape',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.INCIDENT,
    text: 'Incident ??',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.INCIDENT
    }
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.BIKE,
    text: 'Vélo',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.BIKE.ID
    }
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.STEP,
    text: 'Étape maintenance',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.STRING
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.BIKE_STATUS,
    text: 'État vélo',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID,
      localField: TABLES.MAINTENANCE.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.STATUS
    }
  }, {
    id: TABLES.MAINTENANCE.COLUMNS.BIKE_TYPE,
    text: 'Type vélo',
    table_id: TABLES.MAINTENANCE.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID,
      localField: TABLES.MAINTENANCE.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.TYPE
    }
  }])

  // Incident
  await knex('table').insert([{
    id: TABLES.INCIDENT.ID,
    text: 'Incident',
    database_id: DATABASE_ID
  }])
  await knex('table_column').insert([{
    id: TABLES.INCIDENT.COLUMNS.BIKE,
    text: 'Vélo',
    table_id: TABLES.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.RELATION_BETWEEN_TABLES,
    settings: {
      tableId: TABLES.BIKE.ID
    }
  }, {
    id: TABLES.INCIDENT.COLUMNS.SOCIETY,
    text: 'Société',
    table_id: TABLES.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.LOOKED_UP_COLUMN,
    settings: {
      tableId: TABLES.BIKE.ID,
      localField: TABLES.INCIDENT.COLUMNS.BIKE,
      foreignField: TABLES.BIKE.COLUMNS.SOCIETY
    }
  }, {
    id: TABLES.INCIDENT.COLUMNS.TYPE,
    text: 'Type d\'incident',
    table_id: TABLES.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.INCIDENT
    }
  }, {
    id: TABLES.INCIDENT.COLUMNS.STATUS,
    text: 'État',
    table_id: TABLES.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.SINGLE_SELECT,
    settings: {
      values: VALUES.USE
    }
  }, {
    id: TABLES.INCIDENT.COLUMNS.DATE,
    text: 'Date',
    table_id: TABLES.INCIDENT.ID,
    column_type_id: glossary.COLUMN_TYPE.DATE
  }])
}
