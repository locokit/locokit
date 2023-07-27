import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<any> {
  try {

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

    await trx.commit()
  } catch (error) {
    console.error(error)
  }
}
