// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { RowData, TableRow } from '../../models/tablerow.model'
import { TableViewColumn } from '../../models/tableviewcolumn.model'

/**
 * Shrink record data for keeping only certains fields
 *
 * @param records
 * Records to shrink
 * @param fields
 * Listing of all fields (columns) to keep in the record
 * @returns
 * An array of all records rebuilt
 */
function shrinkRecordData (records: TableRow[], fields: TableViewColumn[]): Array<Partial<TableRow>> {
  return records.map(d => {
    const newData: Partial<TableRow> = {
      ...d,
      data: {},
    }
    /**
     * We build the data property
     * by filtering fields if they are transmitted (in the case of retrieving TableView records)
     * or undefined (in the case of retrieving Table records)
     */
    fields
      .filter(c => c.transmitted === true || c.transmitted === undefined)
      .forEach((c: TableViewColumn) => {
        (newData.data as RowData)[c.id] = d.data[c.id]
      })
    return newData
  })
}
/**
 * Shrink records data to the necessary fields
 * Useful for table views, where we want to send only data related to the view
 */
export function shrinkRecordsData (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      (context.method === 'find' || context.method === 'get') &&
      context.type === 'after'
    ) {
      if (
        context.params.paginate ||
        context.params.paginate === undefined
      ) {
        /**
         * Only for find / get + after hook
         */
        context.result.data = shrinkRecordData(context.result.data, context.params._meta.columns)
      } else {
        context.result = shrinkRecordData(context.result, context.params._meta.columns)
      }
    }

    return context
  }
};
