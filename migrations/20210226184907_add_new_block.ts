import * as Knex from 'knex'
import { formatAlterTableEnumSql } from '../knexutils/databaseConstraint'

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
      'Default'
    ])
  )
}

export async function down (knex: Knex): Promise<void> {
  await knex.transaction(async trx => {

    await knex('block')
      .where('type', 'in', ['MapView', 'Synthesis', 'MapDetailView'])
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
        'Default'
      ])
    )
    await trx.commit()
  })
}
