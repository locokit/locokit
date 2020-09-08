import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { USERS } from '../glossary/user_group'

export async function seed (knex: Knex): Promise<any> {
  /**
   * Training
   */
  await knex('table_row').insert([
    {
      id: '993c29f8-3349-400b-90e4-67e806b2fa0a',
      text: 'Formation n°XXXX',
      table_id: TABLES.TRAINING.ID,
      data: JSON.stringify({
        [TABLES.TRAINING.COLUMNS.BIKE]: {
          reference: '04eb6854-3550-4406-ad51-9fc478409cc4',
          value: 'Vélo 001122'
        },
        [TABLES.TRAINING.COLUMNS.SOCIETY]: {
          value: 'Sarl rc & co',
        },
        [TABLES.TRAINING.COLUMNS.TYPE]: {
          value: 'VCAE Bi'
        },
        [TABLES.TRAINING.COLUMNS.STATUS]: 2,
        [TABLES.TRAINING.COLUMNS.TRAINER]: 'Mr Formateur EXPERT',
        [TABLES.TRAINING.COLUMNS.INSTITUTION]: 2,
        [TABLES.TRAINING.COLUMNS.BENEFICIARY_USER]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ'
        },
        [TABLES.TRAINING.COLUMNS.DATE]: '26/08/2020'
      })
    }
  ])


}
