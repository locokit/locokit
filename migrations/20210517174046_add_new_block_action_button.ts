import * as Knex from 'knex'

// Github issue: https://github.com/knex/knex/issues/1699
const formatAlterTableEnumSql = (
  tableName: string,
  columnName: string,
  enums: string[]
) => {
  const constraintName = `${tableName}_${columnName}_check`
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(
      '\'::text, \''
    )}'::text]));`
  ].join('\n')
}

export async function up (knex: Knex): Promise<void> {
  await knex.raw(
    formatAlterTableEnumSql('block', 'type', [
      'TableView',
      'DetailView',
      'Paragraph',
      'Markdown',
      'Heading',
      'Media',
      'KanbanView',
      'GridView',
      'MapView',
      'Synthesis',
      'MapDetailView',
      'ActionButton',
      'Default'
    ])
  )
}

export async function down (knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex('block')
      .where('type', 'ActionButton')
      .update({
        type: 'Default'
      })

    await knex.raw(
      formatAlterTableEnumSql('block', 'type', [
        'TableView',
        'DetailView',
        'Paragraph',
        'Markdown',
        'Heading',
        'Media',
        'KanbanView',
        'GridView',
        'MapView',
        'Synthesis',
        'MapDetailView',
        'Default'
      ])
    )
    await trx.commit()
  })
}
