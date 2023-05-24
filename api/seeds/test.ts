import bcrypt from 'bcryptjs'
import { USER_PROFILE } from '@locokit/definitions'
import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<any> {
  try {
    const hashPassword = await bcrypt.hash('locokit', 10)

    const trx = await knex.transaction()
    /**
     * remove each workspace
     */
    console.log('Removing all workspace dedicated schemas')
    const workspaces = await knex('lck_workspace').withSchema('core').transacting(trx).select()

    await Promise.all(
      workspaces.map(async (w) => {
        console.log('Removing workspace with id ', w.id, 'and slug', w.slug)
        await knex.raw('SELECT core."dropWorkspaceSchema"(?)', w.slug).transacting(trx)
      }),
    )

    console.log('All workspaces dedicated schemas removed')

    await knex('lck_workspace').withSchema('core').transacting(trx).delete()

    console.log('Workspaces removed')
    /**
     * remove all users
     */
    console.log('Removing users...')
    await knex('lck_user').withSchema('core').transacting(trx).delete()
    console.log('Users removed')

    console.log('Inserting test users...')
    const usersToInsert = [
      {
        firstName: 'John',
        lastName: 'ADMIN',
        username: 'john',
        email: 'admin@locokit.io',
        password: hashPassword,
        profile: USER_PROFILE.ADMIN,
        isVerified: true,
      },
      {
        firstName: 'Leonardo',
        lastName: 'CREATOR',
        username: 'leonardo',
        email: 'creator@locokit.io',
        password: hashPassword,
        profile: USER_PROFILE.CREATOR,
        isVerified: true,
      },
      {
        firstName: 'Jack',
        lastName: 'MEMBER',
        username: 'jack',
        email: 'member@locokit.io',
        password: hashPassword,
        profile: USER_PROFILE.MEMBER,
        isVerified: true,
      },
    ]
    const usersInserted: Array<{ id: string }> = await knex('lck_user')
      .withSchema('core')
      .transacting(trx)
      .insert(usersToInsert)
      .returning('id')

    console.log(usersInserted)

    await trx.commit()
  } catch (error) {
    console.error(error)
  }
}
