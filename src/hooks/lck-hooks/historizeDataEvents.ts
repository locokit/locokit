import { Hook, HookContext } from "@feathersjs/feathers";

/**
 * Historize all events on a row :
 * * who create / update it (remove ?)
 * * when
 * * what data
 * * which values (from > to)
 */
export function historizeDataEvents (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    switch(context.method) {
      case 'create':
        console.log(
          'event to historize',
          'by', context.params.user,
          'row.create',
          'from:', null,
          'to', context.result
        )
        break;
      case 'update':
        console.log(
          'event to historize',
          'by', context.params.user,
          'row.update',
          'from:', context.params._meta.row,
          'to', context.result
        )
        break;
      case 'patch':
        console.log(
          'event to historize',
          'by', context.params.user,
          'row.patch',
          'from:',
          context.params._meta.columnsIdsTransmitted.map((columnId: string) => ({
            reference: columnId,
            value: context.params._meta.row.data[columnId]
          })),
          'to:',
          context.params._meta.columnsIdsTransmitted.map((columnId: string) => ({
            reference: columnId,
            value: context.result.data[columnId]
          })),
        )
        break;
      case 'remove':
        console.log(
          'event to historize',
          'by', context.params.user,
          'row.remove',
          'from:', context.params._meta.row,
        )
        break;
    }
    return context;
  };
}
