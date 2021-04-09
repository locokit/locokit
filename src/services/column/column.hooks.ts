import * as authentication from '@feathersjs/authentication'
import { disablePagination, disallow, iff, preventChanges } from 'feathers-hooks-common'
import { queryContainsKeys } from '../../hooks/lck-hooks/queryContainsKeys'
import { getCurrentItem } from '../../hooks/lck-hooks/getCurrentItem'
import { createGIX, dropGIX } from './gixGeometryColumn.hook'
import { parseFormula, isFormulaColumn, updatedRelatedRowsFormula } from './formulaColumn.hook'
import { removeTableColumnRelationTo } from './removeTableColumnRelationTo.hook'
import { fillLookedUpColumnInTableRowData } from './fillLookedUpColumnInTableRowData.hook'
import { upsertColumnRelation } from './upsertColumnRelation.hook'
const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [
      iff(
        queryContainsKeys(['table_id']),
        disablePagination(),
      ),
    ],
    get: [],
    create: [
      iff(isFormulaColumn(), parseFormula()),
    ],
    update: [
      disallow('external'),
    ],
    patch: [
      getCurrentItem(),
      iff(isFormulaColumn(), parseFormula()),
      preventChanges(false, 'column_type_id'),
    ],
    remove: [
      removeTableColumnRelationTo(),
      // disallow('external')
    ],
  },

  after: {
    all: [],
    find: [
    ],
    get: [
    ],
    create: [
      // iff(isGeometryColumn(), createGIX()),
      createGIX(),
      upsertColumnRelation(),
      fillLookedUpColumnInTableRowData(),
      iff(isFormulaColumn(), updatedRelatedRowsFormula()),
    ],
    update: [],
    patch: [
      createGIX(),
      upsertColumnRelation(),
      fillLookedUpColumnInTableRowData(),
      iff(isFormulaColumn(), updatedRelatedRowsFormula()),
    ],
    remove: [
      dropGIX(),
      // iff(isGeometryColumn(), dropGIX()),
    ],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
