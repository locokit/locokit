import { SchemaInspector, createInspector as directusCreateInspector } from '@directus/schema'
import { Knex } from 'knex'

export function createInspector(knex: Knex): SchemaInspector {
  const inspector = directusCreateInspector(knex)
  /**
   * Quick fix for retrieving primary keys
   * when composite keys
   */
  inspector.primary = async (table: string): Promise<string | null> => {
    // @ts-expect-error
    const schemaIn = inspector.explodedSchema.map(
      (schemaName: string) => `${inspector.knex.raw('?', [schemaName])}::regnamespace`,
    )

    const result = await inspector.knex.raw(
      `
         SELECT
            att.attname AS column
          FROM
            (select *, unnest(conkey) as conkey_id from pg_constraint where contype = 'p') as con
          LEFT JOIN pg_class rel ON con.conrelid = rel.oid
          LEFT JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = conkey_id
          WHERE con.connamespace IN (${schemaIn})
            AND con.contype = 'p'
            AND rel.relname = ?
        `,
      [table],
    )

    return result.rows?.map((r: { column: string }) => /* table + '.' + */ r.column) ?? null
  }
  return inspector
}
