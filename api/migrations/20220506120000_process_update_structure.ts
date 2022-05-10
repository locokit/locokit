import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('process', table => {
      table.uuid('workspace_id').unsigned()
      table.foreign('workspace_id', 'FK_workspace_id').references('id').inTable('workspace')
      table.index('workspace_id')
    })
    .raw(`
      UPDATE process p
      SET workspace_id = (
        SELECT w.id
        FROM public."table" t
        JOIN public."database" d on d.id = t.database_id
        JOIN public."workspace" w on w.id = d.workspace_id
        WHERE t.id = p.table_id
      );
    `)
    .raw(`
      ALTER TABLE process
      ALTER COLUMN workspace_id SET NOT NULL;
    `)
    .raw(`
      ALTER TABLE process
      ADD CONSTRAINT process_table_with_trigger
      CHECK ( NOT ( table_id IS NULL AND trigger != 'MANUAL' ) );
    `)
    .alterTable('process_run', table => {
      table.dropForeign(['process_id'], 'FK_pe_pt_id')
      table.foreign('process_id', 'FK_process_id')
        .references('id')
        .inTable('process')
        .onDelete('CASCADE')
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('process', table => {
      table.dropColumn('workspace_id')
    })
    .alterTable('process_run', table => {
      table.dropForeign(['process_id'], 'FK_process_id')
      table.foreign('process_id', 'FK_pe_pt_id')
        .references('id')
        .inTable('process')
    })
}
