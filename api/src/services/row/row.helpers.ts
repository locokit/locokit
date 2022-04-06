import { LckAttachment } from '../../models/attachment.model'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import Knex from 'knex'

/**
 * Remove an attachment of records/rows.
 *
 * When an attachment is removed from the storage,
 * records/rows need to be updated to stop referencing this attachment.
 */
export async function removeAttachmentOfRows (attachment: LckAttachment): Promise<void> {
  /**
   *  Find in the workspace all fields FILE and their table
   */
  const fields: TableColumn[] = await app.service('column').find({
    query: {
      column_type_id: COLUMN_TYPE.FILE,
      $joinRelation: '[table.[database]]',
      'table:database.workspace_id': attachment.workspace_id,
      $limit: -1,
    },
  }) as TableColumn[]

  const knex = app.get('knex') as Knex

  /**
   * Find all records in these tables with one or more FILE field
   * referencing the attachment being removed
   */
  let sql = ''
  const sqlBindings: string[] = []
  fields.forEach(function (f) {
    sql += (sql === '' ? '' : '\n UNION \n')
    sql += `SELECT tr.id as id, ? as field_id, json_file, json_file_index, tr.data->? as field_data
    FROM table_row tr,
    LATERAL pg_catalog.jsonb_array_elements(case jsonb_typeof(tr.data->?)
        when 'array' then tr.data->?
        else '[]' end) with ordinality arr(json_file, json_file_index)
    WHERE table_id = ?
    AND data->? is not null
    AND json_file->>'id' = ?`
    sqlBindings.push(...[f.id, f.id, f.id, f.id, f.table_id, f.id, attachment.id])
  })

  const recordsToUpdateRaw = await knex.raw(sql, sqlBindings)

  const recordsToUpdate = recordsToUpdateRaw.rows as Array<{
    id: string
    field_id: string
    json_file: {filename: string; id: string;}
    json_file_index: string
    field_data: Array<{filename: string; id: string;}>
  }>
  /**
   * For each record,
   * update the file field by removing the index of the attachment
   */
  await Promise.all(recordsToUpdate.map(r => {
    const attachmentIds = r.field_data.map(f => f.id)
    attachmentIds.splice(parseInt(r.json_file_index, 10) - 1, 1)
    return app.service('row').patch(r.id, {
      data: {
        [r.field_id]: attachmentIds,
      },
    })
  }))
}
