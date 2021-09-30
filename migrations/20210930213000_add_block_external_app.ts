import * as Knex from "knex";
import { formatAlterTableEnumSql } from '../knexutils/databaseConstraint'

export async function up(knex: Knex): Promise<void> {
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
      'ExternalApp',
      'Default'
    ])
  )
}

export async function down(knex: Knex): Promise<void> {
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
