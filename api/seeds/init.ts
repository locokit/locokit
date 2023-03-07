import bcrypt from 'bcryptjs'
import { USER_PROFILE } from '@locokit/definitions'
import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<any> {
  const hashPassword = await bcrypt.hash('locokit', 10)

  const trx = await knex.transaction()

  /**
   * User creation
   */
  const usersToInsert = [
    {
      firstname: 'Master',
      lastname: 'ADMIN',
      username: 'master',
      email: 'admin@locokit.io',
      password: hashPassword,
      profile: USER_PROFILE.ADMIN,
      isVerified: true,
    },
    {
      firstname: 'Leonardo',
      lastname: 'CREATOR',
      username: 'leonardo',
      email: 'creator@locokit.io',
      password: hashPassword,
      profile: USER_PROFILE.CREATOR,
      isVerified: true,
    },
    {
      firstname: 'Jack',
      lastname: 'MEMBER',
      username: 'jack',
      email: 'member@locokit.io',
      password: hashPassword,
      profile: USER_PROFILE.MEMBER,
      isVerified: true,
    },
  ]
  const usersInserted: any[] = await knex('lck_user')
    .withSchema('core')
    .transacting(trx)
    .insert(usersToInsert)
    .returning('id')

  /**
   * Workspace creation with CREATOR
   */
  const workspacesToInsert = [
    {
      name: 'Workspace Nutrieduc',
      slug: 'nutrieduc',
      createdBy: usersInserted[1].id
    }
  ]
  const workspacesInserted = await knex('lck_workspace')
    .withSchema('core')
    .transacting(trx)
    .insert(workspacesToInsert)
    .returning('id')

  await knex.raw('SELECT core."createWorkspaceSchema"(?);', workspacesInserted[0].id).transacting(trx)

  /**
   * Datasource
   */
  const datasourcesToInsert = [
    {
      name: 'DS Nut',
      slug: 'ds_nutrieduc13',
      client: 'sqlite3',
      connection: './nutrieduc13.db'
    }
  ]
  const datasourcesInserted = await knex('datasource')
    .withSchema('w_nutrieduc')
    .transacting(trx)
    .insert(datasourcesToInsert)
    .returning('id')

  await trx.commit()
}
