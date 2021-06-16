import * as Knex from "knex";

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


export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    formatAlterTableEnumSql('block', 'type', [
      'TableView',
      'TableSet',
      'DetailView',
      'DataRecord',
      'Paragraph',
      'Markdown',
      'Heading',
      'Media',
      'KanbanView',
      'KanbanSet',
      'GridView',
      'MapView',
      'MapSet',
      'Synthesis',
      'HighlightField',
      'MapDetailView',
      'MapField',
      'ActionButton',
      'Default'
    ])
  )
  await knex('block')
    .where('type', 'TableView')
    .update({
      type: 'TableSet'
    })
  await knex('block')
    .where('type', 'DetailView')
    .update({
      type: 'DataRecord'
    })
  await knex('block')
    .where('type', 'Heading')
    .update({
      type: 'Default'
    })
  await knex('block')
    .where('type', 'KanbanView')
    .update({
      type: 'KanbanSet'
    })
  await knex('block')
    .where('type', 'Synthesis')
    .update({
      type: 'HighlightField'
    })
  await knex('block')
    .where('type', 'GridView')
    .update({
      type: 'Default'
    })
  await knex('block')
    .where('type', 'MapView')
    .update({
      type: 'MapSet'
    })
  await knex('block')
    .where('type','MapDetailView')
    .update({
      type: 'MapField'
    })

  await knex.raw(
    formatAlterTableEnumSql('block', 'type', [
      'TableSet',
      'DataRecord',
      'Paragraph',
      'Markdown',
      'Media',
      'KanbanSet',
      'MapSet',
      'MapField',
      'HighlightField',
      'ActionButton',
      'CardSet',
      'MarkdownField',
      'FormRecord',
      'Default'
    ])
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    formatAlterTableEnumSql('block', 'type', [
      'TableView',
      'TableSet',
      'DetailView',
      'DataRecord',
      'Paragraph',
      'Markdown',
      'Heading',
      'Media',
      'KanbanView',
      'KanbanSet',
      'GridView',
      'MapView',
      'MapSet',
      'Synthesis',
      'HighlightField',
      'MapDetailView',
      'MapField',
      'ActionButton',
      'Default'
    ])
  )
  await knex('block')
    .where('type', 'TableSet')
    .update({
      type: 'TableView'
    })
  await knex('block')
    .where('type', 'DataRecord')
    .update({
      type: 'DetailView'
    })
  await knex('block')
    .where('type', 'KanbanSet')
    .update({
      type: 'KanbanView'
    })
  await knex('block')
    .where('type', 'Map')
    .update({
      type: 'MapView'
    })
  await knex('block')
    .where('type', 'MapField')
    .update({
      type: 'MapDetailView'
    })
  await knex('block')
    .where('type', 'CardSet')
    .update({
      type: 'Default'
    })
  await knex('block')
    .where('type', 'MarkdownField')
    .update({
      type: 'Default'
    })
  await knex('block')
    .where('type', 'FormRecord')
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
      'ActionButton',
      'Default'
    ])
  )
}

