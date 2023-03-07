import bcrypt from 'bcryptjs'
import { USER_PROFILE } from '@locokit/definitions'

export async function seed(knex): Promise<any> {
  const hashPassword = await bcrypt.hash('locokit', 10)

  const usersToInsert = [
    {
      id: 1,
      name: 'SUPER ADMIN',
      email: 'superadmin@locokit.io',
      password: hashPassword,
      profile: USER_PROFILE.ADMIN,
      isVerified: true,
    },
    {
      id: 2,
      name: 'SUPER TEST',
      email: 'supertest@locokit.io',
      password: hashPassword,
      profile: USER_PROFILE.MEMBER,
      isVerified: true,
    },
  ]
  await knex('user').insert(usersToInsert)

  await knex.raw(`SELECT setval('user_id_seq', ${Object.keys(usersToInsert).length})`)
}
