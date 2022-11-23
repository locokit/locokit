import type { Knex } from 'knex'
import fs from 'fs'
import path from 'path'

const createWorkspaceSchemaCode = fs.readFileSync(
  path.join(__dirname, './createWorkspaceSchema.sql'),
  'utf-8',
)
const dropWorkspaceSchemaCode = fs.readFileSync(
  path.join(__dirname, './dropWorkspaceSchema.sql'),
  'utf-8',
)

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('core')
    .raw(createWorkspaceSchemaCode)
    .raw(dropWorkspaceSchemaCode)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').raw(`
  DROP FUNCTION core."dropWorkspaceSchema";
  DROP FUNCTION core."createWorkspaceSchema";
  `)
}
