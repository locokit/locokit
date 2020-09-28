import * as authentication from '@feathersjs/authentication';
import { disablePagination, discardQuery, iff } from 'feathers-hooks-common';
import { queryContainsKey } from '../../hooks/lck-hooks/queryContainsKey';
const { authenticate } = authentication.hooks;

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
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
