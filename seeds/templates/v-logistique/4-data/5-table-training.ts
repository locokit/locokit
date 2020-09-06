import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'

export async function seed (knex: Knex): Promise<any> {
  /**
   * Training
   */
  await knex('table_row').insert([
    {
      id: '6b12a209-9a62-422b-80f2-3dad6340fecd',
      text: 'Formaton n°XXXX',
      table_id: TABLES.TRAINING.ID,
      data: JSON.stringify({
        [TABLES.TRAINING.COLUMNS.TYPE]: 2,
        [TABLES.TRAINING.COLUMNS.INSTITUTION]: 2,
        [TABLES.TRAINING.COLUMNS.TRAINER]: 'Non communiqué',
        [TABLES.TRAINING.COLUMNS.FILE]: '',
        [TABLES.TRAINING.COLUMNS.DATE]: '10/10/2020',
        [TABLES.TRAINING.COLUMNS.USER]: {
          reference: 6,
          value: 'Hervé LECOQ'
        },
        [TABLES.TRAINING.COLUMNS.FILE]: 'Doc',
        [TABLES.TRAINING.COLUMNS.RATING]: 6
      })
    },    {
      id: '993c29f8-3349-400b-90e4-67e806b2fa0a',
      text: 'Formation n°XXXX',
      table_id: TABLES.TRAINING.ID,
      data: JSON.stringify({
        [TABLES.TRAINING.COLUMNS.SOCIETY]: 'Makina',
        [TABLES.TRAINING.COLUMNS.TYPE]: 2,
        [TABLES.TRAINING.COLUMNS.FORMATION]: 2,
        [TABLES.TRAINING.COLUMNS.DATE]: '26/08/2020'
      })
    }
  ])


}
