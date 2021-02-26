import * as authentication from '@feathersjs/authentication'
import { disablePagination, disallow, iff, preventChanges } from 'feathers-hooks-common'
import { queryContainsKeys } from '../../hooks/lck-hooks/queryContainsKeys'
import { createGIX, dropGIX } from './gixGeometryColumn.hook'
import { removeTableColumnRelationTo } from './removeTableColumnRelationTo.hook'
import { fillLookedUpColumnInTableRowData } from './fillLookedUpColumnInTableRowData.hook'
import { upsertColumnRelation } from './upsertColumnRelation.hook'
import { setOriginalColumnTypeForLookedUpColumn } from './setOriginalColumnTypeForLookedUpColumn.hook'
const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [
      iff(
        queryContainsKeys(['table_id']),
        disablePagination()
      )
    ],
    get: [],
    create: [],
    update: [
      disallow('external')
    ],
    patch: [
      preventChanges(true, 'column_type_id')
    ],
    remove: [
      removeTableColumnRelationTo()
      // disallow('external')
    ]
  },

  after: {
    all: [],
    find: [
      setOriginalColumnTypeForLookedUpColumn()
    ],
    get: [
      setOriginalColumnTypeForLookedUpColumn()
    ],
    create: [
      // iff(isGeometryColumn(), createGIX()),
      createGIX(),
      upsertColumnRelation(),
      fillLookedUpColumnInTableRowData()
    ],
    update: [],
    patch: [],
    remove: [
      dropGIX()
      // iff(isGeometryColumn(), dropGIX()),
    ]
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
}
