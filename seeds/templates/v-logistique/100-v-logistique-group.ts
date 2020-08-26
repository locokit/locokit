import * as Knex from 'knex'
import { hash } from 'bcryptjs'

export const GROUPS = {
  ADMIN: '163c21e6-5339-4748-903f-8c77e21314cf',
  PROVIDER: 'd39f102b-398a-4d51-9680-3c479abdda73',
  RECIPIENT: '895ec967-fa3b-4710-82e7-b406e62f657d',
  MORIO: 'cee8d0de-f9f1-45c0-a03d-28d30890a3d6',
  ROZO: '6421abfa-de18-11ea-87d0-0242ac130003'
}

export async function seed (knex: Knex): Promise<any> {
  const hashPassword = await hash('pouetpouet', 10)
  await knex('user').insert([
    {
      id: 2,
      first_name: 'ADMIN',
      last_name: 'v-logistique',
      email: 'admin@makina-corpus.net',
      password: hashPassword,
      profile: 'ADMIN'
    },
    {
      id: 3,
      first_name: 'Fournisseur',
      last_name: 'CYCLABLE ENTREPRISE',
      email: 'cyclable.entreprise@makina-corpus.net',
      password: hashPassword,
      profile: 'USER'
    },
    {
      id: 4,
      first_name: 'Fournisseur',
      last_name: 'AMSTERDAMAIR',
      email: 'amsterdamair@makina-corpus.net',
      password: hashPassword,
      profile: 'USER'
    },
    {
      id: 5,
      first_name: 'Bénéficiaire',
      last_name: 'A',
      email: 'beneficiairea@makina-corpus.net',
      password: hashPassword,
      profile: 'USER'
    },
    {
      id: 6,
      first_name: 'Hervé',
      last_name: 'LECOQ',
      email: 'la.boulangerie@orange.fr',
      password: hashPassword,
      profile: 'USER'
    },
    {
      id: 7,
      first_name: 'Inconnu',
      last_name: 'sans groupe',
      email: 'unknown@makina-corpus.net',
      password: hashPassword,
      profile: 'USER'
    },
    {
      id: 8,
      first_name: 'Fournisseur',
      last_name: 'CYCLELAB',
      email: 'cyclelab@makina-corpus.net',
      password: hashPassword,
      profile: 'USER'
    },
    {
      id: 9,
      first_name: 'Jean',
      last_name: 'VENET',
      email: 'jean@morio.co',
      password: hashPassword,
      profile: 'USER'
    },
    {
      id: 10,
      first_name: 'Rozo',
      last_name: 'R',
      email: 'rozo@makina-corpus.net',
      password: hashPassword,
      profile: 'USER'
    }
  ])
  await knex('group').insert([
    {
      id: GROUPS.PROVIDER,
      name: 'Fournisseurs'
    }, {
      id: GROUPS.ROZO,
      name: 'Rozo'
    },
    {
      id: GROUPS.RECIPIENT,
      name: 'Bénéficiaires'
    },
    {
      id: GROUPS.ADMIN,
      name: 'Admin'
    },
    {
      id: GROUPS.MORIO,
      name: 'Morio'
    }
  ])
  await knex('user_has_group').insert([
    {
      user_id: 2,
      group_id: GROUPS.ADMIN,
      role: 'OWNER'
    },
    {
      user_id: 3,
      group_id: GROUPS.PROVIDER,
      role: 'MEMBER'
    },
    {
      user_id: 4,
      group_id: GROUPS.PROVIDER,
      role: 'MEMBER'
    },
    {
      user_id: 8,
      group_id: GROUPS.PROVIDER,
      role: 'MEMBER'
    },
    {
      user_id: 5,
      group_id: GROUPS.RECIPIENT,
      role: 'MEMBER'
    },
    {
      user_id: 6,
      group_id: GROUPS.RECIPIENT,
      role: 'MEMBER'
    },
    {
      user_id: 7,
      group_id: GROUPS.ROZO,
      role: 'MEMBER'
    }
  ])
}
