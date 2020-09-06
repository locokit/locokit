import * as Knex from 'knex'
import { hash } from 'bcryptjs'
import { USERS } from '../glossary/user_group'

export async function seed (knex: Knex): Promise<any> {
  const hashPassword = await hash('pouetpouet', 10)

  const usersToInsert = Object.keys(USERS).map(k => ({
    ...USERS[k],
    password: hashPassword,
  }))

  await knex('user').insert(usersToInsert)

}
