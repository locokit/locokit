import * as Knex from 'knex'
import { GROUPS } from '../glossary/user_group'

export async function seed (knex: Knex): Promise<any> {
  await knex('group').insert([{
    id: GROUPS.PROVIDER,
    name: 'Fournisseurs'
  }, {
    id: GROUPS.ROZO,
    name: 'Rozo'
  }, {
    id: GROUPS.RECIPIENT,
    name: 'Bénéficiaires'
  }, {
    id: GROUPS.ADMIN,
    name: 'Admin'
  }, {
    id: GROUPS.MORIO,
    name: 'Morio'
  }, {
    id: GROUPS.FUB,
    name: 'Fub'
  }])
}
