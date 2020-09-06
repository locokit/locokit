import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'

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
        [TABLES.REQUEST.COLUMNS.PERSON]: 'Test TEST',
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
        [TABLES.REQUEST.COLUMNS.STEP]: '01/07/2020',
      })
    }, {
      id: '4f4cb5ab-7375-4568-8109-3474c7f86df4',
      text: 'Bénéficiaire A',
      table_id: TABLES.REQUEST.ID,
      data: JSON.stringify({
        [TABLES.REQUEST.COLUMNS.NUM_REQUEST]: '42',
        [TABLES.REQUEST.COLUMNS.SOCIETY]: 'Makina',
        [TABLES.REQUEST.COLUMNS.PERSON]: 'Bénéficiaire A',
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
      })
    }, {
      id: 'f0622f55-995f-4f8c-b0be-ae3ada79a533',
      text: 'Hervé LECOQ',
      table_id: TABLES.REQUEST.ID,
      data: JSON.stringify({
        [TABLES.REQUEST.COLUMNS.NUM_REQUEST]: '136',
        [TABLES.REQUEST.COLUMNS.SOCIETY]: 'Sarl rc & co',
        [TABLES.REQUEST.COLUMNS.PERSON]: 'Hervé LECOQ',
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
        [TABLES.REQUEST.COLUMNS.STATUS_PERSON]: 2,
        [TABLES.REQUEST.COLUMNS.STATUS_FOLDER]: 2,
        [TABLES.REQUEST.COLUMNS.STATUS_PROGRAM]: 3,

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
        [TABLES.MAINTENANCE.COLUMNS.IDENTITY]: 'Non communiqué',
        [TABLES.MAINTENANCE.COLUMNS.STATUS]: 1,
        [TABLES.MAINTENANCE.COLUMNS.RECIPIENT]: {
          reference: 6,
          value: 'Hervé LECOQ'
        },
        [TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
        [TABLES.MAINTENANCE.COLUMNS.TECHNICIAN]: 'Non communiqué',
        [TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_STEP]: 1
      })
    }, {
      id: 'f66879e0-a0b9-496f-bc02-f46c1fe91ccd',
      text: 'Vélo n° XXXX',
      table_id: TABLES.MAINTENANCE.ID,
      data: JSON.stringify({
        [TABLES.MAINTENANCE.COLUMNS.TYPE]: 2,
        [TABLES.MAINTENANCE.COLUMNS.IDENTITY]: 'Non communiqué',
        [TABLES.MAINTENANCE.COLUMNS.INCIDENT]: 3,
        [TABLES.MAINTENANCE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
        [TABLES.MAINTENANCE.COLUMNS.RECIPIENT]: {
          reference: 6,
          value: 'Hervé LECOQ' // Todo: Get society
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
      [TABLES.INCIDENT.COLUMNS.SOCIETY]: 'Makina',
      [TABLES.INCIDENT.COLUMNS.TYPE]: 2,
      [TABLES.INCIDENT.COLUMNS.STATUS]: 2,
      [TABLES.INCIDENT.COLUMNS.INCIDENT]: 2,
      [TABLES.INCIDENT.COLUMNS.DATE]: '26/08/2020'
    })
  }])


  /**
   * Type de vélo
   */


  /**
   * Vélo
   */
  await knex('table_row').insert([
    {
      id: '04eb6854-3550-4406-ad51-9fc478409cc4',
      text: 'Vélo n° XXXX',
      table_id: TABLES.BIKE.ID,
      data: JSON.stringify({
        [TABLES.BIKE.COLUMNS.REF]: 'Non communiqué',
        [TABLES.BIKE.COLUMNS.TYPE]: {
          reference: '',
          value: 'VCAE Bi ?'
        },
        [TABLES.BIKE.COLUMNS.BRAND]: {
          value: 'Non communiqué',
        },
        [TABLES.BIKE.COLUMNS.STATUS]: TABLES.BIKE.DATA.STATUS_IN_USE,
        [TABLES.BIKE.COLUMNS.MAINTENANCE_DATE]: '10/10/2020',
        [TABLES.BIKE.COLUMNS.COMMISSIONING_DATE]: '17/07/2020',
        [TABLES.BIKE.COLUMNS.DELIVERY_ESTIMATED_DATE]: '10/07/2020',
        [TABLES.BIKE.COLUMNS.PROVIDER]: {
          reference: 3,
          value: 'CYCLABLE ENTREPRISE'
        },
        [TABLES.BIKE.COLUMNS.RECIPIENT]: {
          reference: 6,
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
          value: null,
        },
        [TABLES.BIKE.COLUMNS.NUM_REQUEST]: {
          value: null,
        },
        [TABLES.BIKE.COLUMNS.LOT]: {
          value: 2,
        },
        [TABLES.BIKE.COLUMNS.SOCIETY]: {
          value: 'Sarl rc & co',
        },
        [TABLES.BIKE.COLUMNS.PERIOD]: null,
      })
    }
  ])

}
