import * as Knex from "knex";
import { formatAlterTableEnumSql } from '../utils/databaseConstraint'

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
    .where('type', 'MapSet')
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

