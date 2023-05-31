import bcrypt from 'bcryptjs'
import { USER_PROFILE } from '@locokit/definitions'

export async function seed(knex): Promise<any> {
  const hashPassword = await bcrypt.hash(process.env.LCK_ADMIN_PASSWORD || 'locokit', 10)

  const usersToInsert = [
    {
      id: 1,
      name: 'ADMIN',
      email: 'admin@locokit.io',
      password: hashPassword,
      profile: USER_PROFILE.ADMIN,
      isVerified: true,
    },
  ]
  await knex('user').insert(usersToInsert)

  await knex.raw(`SELECT setval('user_id_seq', ${Object.keys(usersToInsert).length})`)
}
