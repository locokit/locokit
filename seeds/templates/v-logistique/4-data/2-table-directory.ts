import * as Knex from 'knex'
import { TABLES } from '../glossary/schema'
import { USERS } from '../glossary/user_group'

export async function seed (knex: Knex): Promise<any> {
  /**
   * Personnes
   */
  await knex('table_row').insert([
    {
      id: '9df5d11e-a5a1-4ba8-94bd-c399944c9030',
      text: 'Inconnu',
      table_id: TABLES.PERSON.ID,
      data: JSON.stringify({
        [TABLES.PERSON.COLUMNS.FIRST_NAME]: 'Inconnu',
        [TABLES.PERSON.COLUMNS.LAST_NAME]: 'Sans groupe',
        [TABLES.PERSON.COLUMNS.USER]: {
          reference: USERS.unknown.id,
          value: 'Hervé LECOQ'
        },
      })
    }, {
      id: '96c0ea7e-b261-4ec0-9477-024962911485',
      text: 'Bénéficiaire A',
      table_id: TABLES.PERSON.ID,
      data: JSON.stringify({
        [TABLES.PERSON.COLUMNS.FIRST_NAME]: 'Bénéficiaire A',
        [TABLES.PERSON.COLUMNS.LAST_NAME]: 'Makina',
        [TABLES.PERSON.COLUMNS.USER]: {
          reference: USERS.beneficiairea.id,
          value: 'Bénéficiaire A'
        }
      })
    }, {
      id: '345f571b-b1df-4e8d-a636-e2121ba8ecfb',
      text: 'Hervé LECOQ',
      table_id: TABLES.PERSON.ID,
      data: JSON.stringify({
        [TABLES.PERSON.COLUMNS.FIRST_NAME]: 'Hervé',
        [TABLES.PERSON.COLUMNS.LAST_NAME]: 'LECOQ',
        [TABLES.PERSON.COLUMNS.USER]: {
          reference: USERS.hervelecoq.id,
          value: 'Hervé LECOQ'
        }
      })
    }
  ])


  /**
   * Providers
   */
  await knex('table_row').insert([
    {
      id: 'e5328205-f34c-4fa1-a6d8-7da8c4f37036',
      text: 'CYCLABLE ENTREPRISE',
      table_id: TABLES.SUPPLIER.ID,
      data: JSON.stringify({
        [TABLES.SUPPLIER.COLUMNS.NAME]: 'CYCLABLE ENTREPRISE',
        [TABLES.SUPPLIER.COLUMNS.GEOZONE]: '75 93 94 92 78 60 22 29 35 56 44 49 53 72 85 79 86 17 16 18 28 16 17 45 41 14 61 50 27 76 95 77 91',
        [TABLES.SUPPLIER.COLUMNS.USER]: {
          reference: USERS.cyclable.id,
          value: 'Fournisseur CYCLABLE ENTREPRISE'
        }
      })
    }, {
      id: 'a30a590b-2939-4240-8b20-4728bf0d7649',
      text: 'AMSTERDAMAIR',
      table_id: TABLES.SUPPLIER.ID,
      data: JSON.stringify({
        [TABLES.SUPPLIER.COLUMNS.NAME]: 'AMSTERDAMAIR',
        [TABLES.SUPPLIER.COLUMNS.GEOZONE]: '62 59 80 02 08 10 52 89 58 21 71 70 25 39 90 68 67 54 55 57 88 51',
        [TABLES.SUPPLIER.COLUMNS.USER]: {
          reference: USERS.amsterdamair.id,
          value: 'Fournisseur AMSTERDAMAIR'
        }
      })
    }, {
      id: '22ba7040-7a38-4013-b993-52deacf1c729',
      text: 'CYCLELAB',
      table_id: TABLES.SUPPLIER.ID,
      data: JSON.stringify({
        [TABLES.SUPPLIER.COLUMNS.NAME]: 'CYCLELAB',
        [TABLES.SUPPLIER.COLUMNS.GEOZONE]: '33 24 47 40 64 19 87 23 03 15 43 63 09 12 31 32 46 65 81 82 48 11 30 34 66 01 07 26 38 49 69 73 74 84 13 83 06 04 05 42',
        [TABLES.SUPPLIER.COLUMNS.USER]: {
          reference: USERS.cyclelab.id,
          value: 'Fournisseur CYCLELAB'
        }
      })
    }
  ])

}
