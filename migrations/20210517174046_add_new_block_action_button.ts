import * as Knex from 'knex'
import { formatAlterTableEnumSql } from '../utils/databaseConstraint'

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
