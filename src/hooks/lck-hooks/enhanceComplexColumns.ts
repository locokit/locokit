import { Hook, HookContext } from "@feathersjs/feathers";
import { column as LckColumn } from '../../models/column.model';
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { row } from '../../models/row.model';
import { user } from "../../models/user.model";

/**
 * Retrieve the display value
 * for all columns that are "relation between tables" or "user"
 * that are transmitted in a create / update / patch request.
 *
 * Need the loadColumnsDefinition hook before.
 */
export function enhanceComplexColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    await Promise.all(
      Object.keys(context.data.data)
      .map(async currentColumnId => {
        const currentColumnDefinition = (context.params._meta.columns as LckColumn[]).find((c: LckColumn) => c.id === currentColumnId)
        const reference = context.data.data[currentColumnId]
        let value = ''
        switch (currentColumnDefinition?.column_type_id) {
          case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
            // retrieve the text value of the matching row
            const matchingRow: row = await context.service.get(reference)
            value = matchingRow.text
            context.params._meta = {
              ...context.params._meta,
              trr: (context.params._meta.trr || []).concat([
                {
                  columnId: currentColumnId,
                  rowId: matchingRow.id
                }
              ])
            }
            context.data.data[currentColumnId] = {
              reference,
              value
            }
            break
          case COLUMN_TYPE.USER:
            const matchingUser: user = await context.app.services.user.get(reference)
            value = matchingUser.name
            context.data.data[currentColumnId] = {
              reference,
              value
            }
        }
      })
    )
    return context;
  };
};
