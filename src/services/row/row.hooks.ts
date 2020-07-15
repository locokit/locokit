
import * as authentication from '@feathersjs/authentication';
import * as commonHooks from 'feathers-hooks-common'
import filterRowsByTableViewId from '../../hooks/filter-view-rows';
const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      filterRowsByTableViewId(),
      commonHooks.discardQuery('table_view_id')
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
