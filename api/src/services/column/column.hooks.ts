import * as authentication from '@feathersjs/authentication'
import { disablePagination, disallow, iff, preventChanges } from 'feathers-hooks-common'
import { getCurrentItem } from '../../hooks/lck-hooks/getCurrentItem'
import { createGIX, dropGIX } from './gixGeometryColumn.hook'
import { parseFormula, isFormulaColumn, updatedRelatedRowsFormula } from './formulaColumn.hook'
import { removeTableColumnRelationTo } from './removeTableColumnRelationTo.hook'
import { fillLookedUpColumnInTableRowData } from './fillLookedUpColumnInTableRowData.hook'
import { upsertColumnRelation } from './upsertColumnRelation.hook'
import { fillDefaultValueOnColumnCreation } from './fillDefaultValueOnColumnCreation'
import { checkColumnDefinition } from './checkColumnDefinition.hook'
import { createOrRefreshSQLViewHook } from '../../hooks/lck-hooks/managementSQLViewHooks'
const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [
      disablePagination(),
    ],
    get: [],
    create: [
      checkColumnDefinition(),
      iff(isFormulaColumn, parseFormula()),
    ],
    update: [
      disallow('external'),
    ],
    patch: [
      preventChanges(true, 'column_type_id'),
      getCurrentItem(),
      checkColumnDefinition(),
      iff(isFormulaColumn, parseFormula()),
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
      iff(isFormulaColumn, updatedRelatedRowsFormula()),
      fillDefaultValueOnColumnCreation(),
      createOrRefreshSQLViewHook,
    ],
    update: [],
    patch: [
      createGIX(),
      upsertColumnRelation(),
      fillLookedUpColumnInTableRowData(),
      iff(isFormulaColumn, updatedRelatedRowsFormula()),
      createOrRefreshSQLViewHook,
    ],
    remove: [
      dropGIX(),
      createOrRefreshSQLViewHook,
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
