import * as authentication from '@feathersjs/authentication';
import { Hook, HookContext } from '@feathersjs/feathers';
import { COLUMN_TYPE } from '@locokit/lck-glossary';
import { disablePagination, disallow, iff } from 'feathers-hooks-common';
import { queryContainsKey } from '../../hooks/lck-hooks/queryContainsKey';
const { authenticate } = authentication.hooks;

/**
 * Hook exclusive to create
 * Add default values for single_select fields if not set
 */
function upsertColumnRelation (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'create') {
      if (context.result.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
        await context.app.services.columnrelation.create({
          table_column_from_id: context.result.settings.foreignField,
          table_column_to_id: context.result.id
        })
      }
    } else {
      console.log('Hook only for create method. For the moment. Need to think about update / patch methods too.')
    }
    return context;
  };
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      iff(
        queryContainsKey('table_id'),
        disablePagination()
      )
    ],
    get: [],
    create: [],
    update: [
      disallow()
    ],
    patch: [
    ],
    remove: [
      disallow()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      upsertColumnRelation(),
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
