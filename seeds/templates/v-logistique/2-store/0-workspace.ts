import * as Knex from 'knex'
import { WORKSPACE_ID } from '../glossary/view'
import { DATABASE_ID } from '../glossary/schema'

export async function seed (knex: Knex): Promise<any> {
  await knex('workspace').insert([
    {
      id: WORKSPACE_ID,
      text: 'v-logistique'
    }
  ])

  await knex('database').insert([
    {
      id: DATABASE_ID,
      text: 'Base principale',
      workspace_id: WORKSPACE_ID
    }
  ])
}
