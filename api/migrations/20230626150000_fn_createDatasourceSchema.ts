import type { Knex } from 'knex'
import fs from 'fs'
import path from 'path'

const createDatasourceSchemaCode = fs.readFileSync(
  path.join(__dirname, './functions/createDatasourceSchema.sql'),
  'utf-8',
)
const dropDatasourceSchemaCode = fs.readFileSync(
  path.join(__dirname, './functions/dropDatasourceSchema.sql'),
  'utf-8',
)

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').raw(createDatasourceSchemaCode).raw(dropDatasourceSchemaCode)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').raw(`
  DROP FUNCTION core."dropDatasourceSchema";
  DROP FUNCTION core."createDatasourceSchema";
  `)
}
