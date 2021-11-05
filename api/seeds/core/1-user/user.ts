import * as Knex from 'knex'
import bcrypt from 'bcryptjs'
import { USER_PROFILE } from '@locokit/lck-glossary'

export async function seed (knex: Knex): Promise<any> {
  const hashPassword = await bcrypt.hash('locokit', 10)

  const usersToInsert = [
    {
      id: 1,
      name: 'SUPER ADMIN',
      email: 'superadmin@makina-corpus.net',
      password: hashPassword,
      profile: USER_PROFILE.SUPERADMIN,
      isVerified: true
    }
  ]
  await knex('user').insert(usersToInsert)

  await knex.raw(`SELECT setval('user_id_seq', ${Object.keys(usersToInsert).length})`)
};
