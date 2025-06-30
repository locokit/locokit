import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<any> {
  try {
    const trx = await knex.transaction()
    /**
     * remove each workspace
     */
    const workspaces = await knex('lck_workspace').withSchema('core').transacting(trx).select()

    await Promise.all(
      workspaces.map(async (w) => {
        await knex.raw('SELECT core."dropWorkspaceSchema"(?)', w.slug).transacting(trx)
      }),
    )

    await knex('lck_group').withSchema('core').transacting(trx).delete()
    await knex('lck_policy').withSchema('core').transacting(trx).delete()
    await knex('lck_workspace').withSchema('core').transacting(trx).delete()

    /**
     * remove all users
     */
    await knex('lck_user').withSchema('core').transacting(trx).delete()

    await trx.commit()
  } catch (error) {
    console.error(error)
  }
}
