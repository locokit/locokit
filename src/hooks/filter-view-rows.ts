// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { LckColumnDTO, LckColumnFilter } from '../models/view.model';
import { glossary } from '../../seeds/core/glossary';

/**
 * Add filters depending on the table view wished
 */
export default function filterRowsByTableViewId(): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.params.query?.table_view_id) {
      const { table_view_id } = context.params.query
      const tableView = await context.app.services.view.get(table_view_id, {
        query: {
          $eager: 'columns'
        },
        paginate: false
      })
      const filtersToAdd: { [key: string]: Object } = {};
      (tableView.columns as LckColumnDTO[])
        .filter((c: LckColumnDTO) => c.filter)
        .forEach((c: LckColumnDTO) => {
          Object.keys(c.filter as LckColumnFilter).forEach(filterKey => {
            let currentFilterKeyValue = (c.filter as LckColumnFilter)[filterKey]
            switch (filterKey) {
              case '$eq':
                currentFilterKeyValue = (
                  (c.filter as LckColumnFilter)[filterKey] as string
                ).replace('{userId}', context.params.user.id)
                if (c.column_type_id === glossary.COLUMN_TYPE.SINGLE_SELECT) {
                  filtersToAdd[c.id] = currentFilterKeyValue
                } else {
                  filtersToAdd[c.id + '.reference'] = currentFilterKeyValue
                }
                break;
              case '$in':
              case '$nin':
                filtersToAdd[c.id] = { [filterKey]: currentFilterKeyValue }
                break;
            }
            console.log(filterKey, typeof currentFilterKeyValue)
            if (currentFilterKeyValue instanceof Array) {
              console.log('array')
            } else if (currentFilterKeyValue instanceof String) {
            } else {
              console.log('object ?')
            }
          })
        })
      context.params.query = {
        ...context.params.query,
        table_id: tableView.table_id,
        data : {
          ...context.params.query.data,
          ...filtersToAdd
        }
      }
      console.log(context.params.query)
    }
    return context;
  };
};
