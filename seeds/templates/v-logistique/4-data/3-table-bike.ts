import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { USERS } from '../glossary/user_group'

export async function seed (knex: Knex): Promise<any> {
  /**
   * Demande
   */
  await knex('table_row').insert([
    {
      id: 'd4f8cdd8-5426-4f88-b61a-456a3baf3dcd',
      text: 'Test',
      table_id: TABLES.REQUEST.ID,
      data: JSON.stringify({
        [TABLES.REQUEST.COLUMNS.NUM_REQUEST]: '17',
        [TABLES.REQUEST.COLUMNS.SOCIETY]: 'FactoryTest',
        [TABLES.REQUEST.COLUMNS.BENEFICIARY]: {
          reference: '9df5d11e-a5a1-4ba8-94bd-c399944c9030',
          value: 'Inconnu sans groupe',
        },
        [TABLES.REQUEST.COLUMNS.BENEFICIARY_USER]: {
          reference: USERS.unknown.id,
        },
        [TABLES.REQUEST.COLUMNS.SUPPLIER]: {
          reference: 'a30a590b-2939-4240-8b20-4728bf0d7649',
          value: 'AMSTERDAMAIR',
        },
        [TABLES.REQUEST.COLUMNS.SUPPLIER_USER]: {
          reference: USERS.amsterdamair.id
        },
        [TABLES.REQUEST.COLUMNS.STATUS]: 1,
        [TABLES.REQUEST.COLUMNS.ADDRESS]: '1 rue du test, Tes',
        [TABLES.REQUEST.COLUMNS.LOT]: 2,
        [TABLES.REQUEST.COLUMNS.NB_VAE]: 1,
        [TABLES.REQUEST.COLUMNS.NB_VCAE_BI]: 0,
        [TABLES.REQUEST.COLUMNS.NB_VCAE_TRI]: 0,
        [TABLES.REQUEST.COLUMNS.EMAIL]: 'test@test.test',
        [TABLES.REQUEST.COLUMNS.PHONE]: '0123456789',
        [TABLES.REQUEST.COLUMNS.APE]: '11111',
        [TABLES.REQUEST.COLUMNS.CREATION_DATE]: '01/07/2020',
        [TABLES.REQUEST.COLUMNS.STEP]: 1,
        [TABLES.REQUEST.COLUMNS.STEP_STATUS]: 2,
        [TABLES.REQUEST.COLUMNS.STATUS_PERSON]: 1,
      })
    }, {
      id: '4f4cb5ab-7375-4568-8109-3474c7f86df4',
      text: 'Bénéficiaire A',
      table_id: TABLES.REQUEST.ID,
      data: JSON.stringify({
        [TABLES.REQUEST.COLUMNS.NUM_REQUEST]: '42',
        [TABLES.REQUEST.COLUMNS.SOCIETY]: 'Makina',
        [TABLES.REQUEST.COLUMNS.BENEFICIARY]: {
          reference: '96c0ea7e-b261-4ec0-9477-024962911485',
          value: 'Bénéficiaire A',
        },
        [TABLES.REQUEST.COLUMNS.BENEFICIARY_USER]: {
          reference: USERS.beneficiairea.id,
        },
        [TABLES.REQUEST.COLUMNS.SUPPLIER]: {
          reference: '22ba7040-7a38-4013-b993-52deacf1c729',
          value: 'CYCLELAB',
        },
        [TABLES.REQUEST.COLUMNS.SUPPLIER_USER]: {
          reference: USERS.cyclelab.id,
        },
        [TABLES.REQUEST.COLUMNS.STATUS]: 2,
        [TABLES.REQUEST.COLUMNS.ADDRESS]: '11 rue du Marchix, Nantes',
        [TABLES.REQUEST.COLUMNS.LOT]: 2,
        [TABLES.REQUEST.COLUMNS.NB_VAE]: 1,
        [TABLES.REQUEST.COLUMNS.NB_VCAE_BI]: 0,
        [TABLES.REQUEST.COLUMNS.NB_VCAE_TRI]: 0,
        [TABLES.REQUEST.COLUMNS.EMAIL]: 'beneficiairea@makina-corpus.net',
        [TABLES.REQUEST.COLUMNS.PHONE]: '0987654321',
        [TABLES.REQUEST.COLUMNS.APE]: '1717A',
        [TABLES.REQUEST.COLUMNS.CREATION_DATE]: '10/07/2020',
        [TABLES.REQUEST.COLUMNS.STEP]: 2,
        [TABLES.REQUEST.COLUMNS.STEP_STATUS]: 2,
        [TABLES.REQUEST.COLUMNS.STATUS_PERSON]: 1,
      })
    }, {
      id: 'f0622f55-995f-4f8c-b0be-ae3ada79a533',
      text: 'Hervé LECOQ (25/06/2020)',
      table_id: TABLES.REQUEST.ID,
      data: JSON.stringify({
        [TABLES.REQUEST.COLUMNS.NUM_REQUEST]: '136',
        [TABLES.REQUEST.COLUMNS.SOCIETY]: 'Sarl rc & co',
        [TABLES.REQUEST.COLUMNS.BENEFICIARY]: {
          reference: '345f571b-b1df-4e8d-a636-e2121ba8ecfb',
          value: 'Hervé LECOQ',
        },
        [TABLES.REQUEST.COLUMNS.BENEFICIARY_USER]: {
          reference: USERS.hervelecoq.id,
        },
        [TABLES.REQUEST.COLUMNS.SUPPLIER]: {
          reference: 'e5328205-f34c-4fa1-a6d8-7da8c4f37036',
          value: 'CYCLABLE ENTREPRISE',
        },
        [TABLES.REQUEST.COLUMNS.SUPPLIER_USER]: {
          reference: USERS.cyclable.id,
        },
        [TABLES.REQUEST.COLUMNS.ADDRESS]: '4 allée Duquesne, Nantes',
        [TABLES.REQUEST.COLUMNS.CREATION_DATE]: '01/07/2020',
        [TABLES.REQUEST.COLUMNS.NB_VAE]: 0,
        [TABLES.REQUEST.COLUMNS.NB_VCAE_BI]: 1,
        [TABLES.REQUEST.COLUMNS.NB_VCAE_TRI]: 0,
        [TABLES.REQUEST.COLUMNS.NB_BIKE]: 1,
        [TABLES.REQUEST.COLUMNS.STATUS]: 3,
        [TABLES.REQUEST.COLUMNS.LOT]: 2,
        [TABLES.REQUEST.COLUMNS.EMAIL]: 'la.boulangerie@orange.fr',
        [TABLES.REQUEST.COLUMNS.PHONE]: '0626093607',
        [TABLES.REQUEST.COLUMNS.APE]: '1071C',
        [TABLES.REQUEST.COLUMNS.CREATION_DATE]: '25/06/2020',
        [TABLES.REQUEST.COLUMNS.STEP]: 5,
        [TABLES.REQUEST.COLUMNS.STEP_STATUS]: 3,
        [TABLES.REQUEST.COLUMNS.STATUS_PERSON]: 2,
        [TABLES.REQUEST.COLUMNS.STATUS_PROGRAM]: 3,

      })
    }
  ])


  /**
   * Type de vélo
   */


  /**
   * Vélo
   */
  await knex('table_row').insert([
    {
      id: '04eb6854-3550-4406-ad51-9fc478409cc4',
      text: 'Vélo 001122',
      table_id: TABLES.BIKE.ID,
      data: JSON.stringify({
        [TABLES.BIKE.COLUMNS.REF]: '001122',
        [TABLES.BIKE.COLUMNS.TYPE]: {
          value: 'VCAE Bi'
        },
        [TABLES.BIKE.COLUMNS.BRAND]: {
          value: 'Non communiqué',
        },
        [TABLES.BIKE.COLUMNS.STATUS]: TABLES.BIKE.DATA.STATUS_IN_USE,
        [TABLES.BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
        [TABLES.BIKE.COLUMNS.STARTING_DATE]: '17/07/2020',
        [TABLES.BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE]: '10/07/2020',
        [TABLES.BIKE.COLUMNS.SUPPLIER]: {
          reference: 'e5328205-f34c-4fa1-a6d8-7da8c4f37036',
          value: 'CYCLABLE ENTREPRISE'
        },
        [TABLES.BIKE.COLUMNS.SUPPLIER_USER]: {
          reference: USERS.cyclable.id,
          value: 'CYCLABLE ENTREPRISE'
        },
        [TABLES.BIKE.COLUMNS.PROVIDER]: 'Atelier Cyclable Nantes ?',
        [TABLES.BIKE.COLUMNS.BENEFICIARY]: {
          reference: '345f571b-b1df-4e8d-a636-e2121ba8ecfb',
          value: 'Hervé LECOQ'
        },
        [TABLES.BIKE.COLUMNS.BENEFICIARY_USER]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ'
        },
        [TABLES.BIKE.COLUMNS.BRAND]: 'Non communiqué',
        [TABLES.BIKE.COLUMNS.TRACER]: {
          value: 'Non communiqué',
        },
        [TABLES.BIKE.COLUMNS.LAST_TRACER_DATA]: {
          value: 'Non communiqué',
        },
        [TABLES.BIKE.COLUMNS.ALERT]: null,
        [TABLES.BIKE.COLUMNS.REQUEST]: {
          reference: 'f0622f55-995f-4f8c-b0be-ae3ada79a533',
          value: 'Hervé LECOQ (25/06/2020)',
        },
        [TABLES.BIKE.COLUMNS.NUM_REQUEST]: {
          value: '136',
        },
        [TABLES.BIKE.COLUMNS.LOT]: {
          reference: 2,
          value: 'Lot 2',
        },
        [TABLES.BIKE.COLUMNS.SOCIETY]: {
          value: 'Sarl rc & co',
        },
        [TABLES.BIKE.COLUMNS.PERIOD]: null,
      })
    }
  ])

  /**
   * Maintenance
   */
  await knex('table_row').insert([
    {
      id: 'f8f0a019-407e-447c-9b28-71ed7ef4dfe0',
      text: 'Vélo n° XXXX',
      table_id: TABLES.MAINTENANCE.ID,
      data: JSON.stringify({
        [TABLES.MAINTENANCE.COLUMNS.TYPE]: 2,
        [TABLES.MAINTENANCE.COLUMNS.IDENTITY]: {
          reference: '04eb6854-3550-4406-ad51-9fc478409cc4',
          value: '001122'
        },
        [TABLES.MAINTENANCE.COLUMNS.STATUS]: 1,
        [TABLES.MAINTENANCE.COLUMNS.BENEFICIARY]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ'
        },
        [TABLES.MAINTENANCE.COLUMNS.BENEFICIARY_USER]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ'
        },
        [TABLES.MAINTENANCE.COLUMNS.SUPPLIER_USER]: {
          reference: USERS.cyclable.id,
          value: 'CYCLABLE ENTREPRISE'
        },
        [TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
        [TABLES.MAINTENANCE.COLUMNS.TECHNICIAN]: 'Non communiqué',
        [TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_STEP]: 1,
        [TABLES.MAINTENANCE.COLUMNS.BIKE]: {
          reference: '04eb6854-3550-4406-ad51-9fc478409cc4',
          value: 'Vélo 001122'
        },
        [TABLES.MAINTENANCE.COLUMNS.BIKE_STATUS]: {
          value: 'En utilisation',
        },
        [TABLES.MAINTENANCE.COLUMNS.BIKE_TYPE]: {
          value: 'VCAE Bi'
        }
      })
    }, {
      id: 'f66879e0-a0b9-496f-bc02-f46c1fe91ccd',
      text: 'Vélo n° XXXX',
      table_id: TABLES.MAINTENANCE.ID,
      data: JSON.stringify({
        [TABLES.MAINTENANCE.COLUMNS.TYPE]: 1,
        [TABLES.MAINTENANCE.COLUMNS.IDENTITY]: {
          reference: '04eb6854-3550-4406-ad51-9fc478409cc4',
          value: '001122'
        },
        [TABLES.MAINTENANCE.COLUMNS.STATUS]: 1,
        [TABLES.MAINTENANCE.COLUMNS.INCIDENT]: 3,
        [TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
        [TABLES.MAINTENANCE.COLUMNS.BENEFICIARY]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ' // Todo: Get society
        },
        [TABLES.MAINTENANCE.COLUMNS.BENEFICIARY_USER]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ'
        },
        [TABLES.MAINTENANCE.COLUMNS.SUPPLIER_USER]: {
          reference: USERS.amsterdamair.id,
          value: 'AMSTERDAMAIR'
        },
        [TABLES.MAINTENANCE.COLUMNS.BIKE]: {
          reference: '04eb6854-3550-4406-ad51-9fc478409cc4',
          value: 'Vélo 001122'
        },
        [TABLES.MAINTENANCE.COLUMNS.BIKE_STATUS]: {
          value: 'En utilisation',
        },
        [TABLES.MAINTENANCE.COLUMNS.BIKE_TYPE]: {
          value: 'VCAE Bi'
        }
      })
    }, {
      id: 'f8c3b3e6-b312-4023-8ad3-2de567fe6f94',
      text: 'Vélo n° XXXX',
      table_id: TABLES.MAINTENANCE.ID,
      data: JSON.stringify({
        [TABLES.MAINTENANCE.COLUMNS.TYPE]: 1,
        [TABLES.MAINTENANCE.COLUMNS.IDENTITY]: {
          reference: '04eb6854-3550-4406-ad51-9fc478409cc4',
          value: '001122'
        },
        [TABLES.MAINTENANCE.COLUMNS.STATUS]: 1,
        [TABLES.MAINTENANCE.COLUMNS.INCIDENT]: 2,
        [TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
        [TABLES.MAINTENANCE.COLUMNS.BENEFICIARY]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ' // Todo: Get society
        },
        [TABLES.MAINTENANCE.COLUMNS.BENEFICIARY_USER]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ'
        },
        [TABLES.MAINTENANCE.COLUMNS.SUPPLIER_USER]: {
          reference: USERS.cyclelab.id,
          value: 'CYCLELAB'
        },
        [TABLES.MAINTENANCE.COLUMNS.BIKE]: {
          reference: '04eb6854-3550-4406-ad51-9fc478409cc4',
          value: 'Vélo 001122'
        },
        [TABLES.MAINTENANCE.COLUMNS.BIKE_STATUS]: {
          value: 'En utilisation',
        },
        [TABLES.MAINTENANCE.COLUMNS.BIKE_TYPE]: {
          value: 'VCAE Bi'
        }
      })
    },
  ])

  /**
   * Incident
   */
  await knex('table_row').insert([{
    id: '8d3513bd-ad0e-4ce7-a7f2-1b453ba16889',
    text: 'Incident n°XXXX',
    table_id: TABLES.INCIDENT.ID,
    data: JSON.stringify({
      [TABLES.INCIDENT.COLUMNS.BIKE]: {
        reference: '04eb6854-3550-4406-ad51-9fc478409cc4',
        value: 'Vélo 001122',
      },
      [TABLES.INCIDENT.COLUMNS.SOCIETY]: {
        value: 'Sarl rc & co',
      },
      [TABLES.INCIDENT.COLUMNS.TYPE]: 2,
      [TABLES.INCIDENT.COLUMNS.STATUS]: 2,
      [TABLES.INCIDENT.COLUMNS.DATE]: '26/08/2020'
    })
  }])


}
