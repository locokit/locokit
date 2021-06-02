
import * as authentication from '@feathersjs/authentication'
import * as commonHooks from 'feathers-hooks-common'
import filterRowsByTableViewId from './filterRowsByTableViewId.hook'
import { isDataSent } from '../../hooks/lck-hooks/isDataSent'
import { getCurrentItem } from '../../hooks/lck-hooks/getCurrentItem'

// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { enhanceComplexColumns } from './enhanceComplexColumns.hook'
import { loadColumnsDefinition, loadUpdatedColumnsWithChildren } from './loadColumnsDefinition.hook'
import { queryContainsKeys } from '../../hooks/lck-hooks/queryContainsKeys'
import { computeTextProperty } from './computeTextProperty.hook'
import { memorizeColumnsIds } from './memorizeColumnsIds.hook'
import { completeDataField } from './completeDataField.hook'
import { completeDefaultValues } from './completeDefaultValues.hook'
import { computeLookedUpColumns } from './computeLookedUpColumns.hook'
import { computeRowLookedUpColumns } from './computeRowLookedUpColumns.hook'
import { computeRowFormulaColumns } from './computeRowFormulaColumns.hook'
import { removeRelatedExecutions, removeRelatedRows } from './removeRelatedRows.hook'
import { restrictRemoveIfRelatedRows } from './restrictRemoveIfRelatedRows.hook'
import { upsertRowRelation } from './upsertRowRelation.hook'
import { checkColumnDefinitionMatching } from './checkColumnDefinitionMatching.hook'
import { triggerProcess } from './triggerProcess.hook'
import { isBulkPatch, isValidBulkPatch, onlyUpdateFormulaColumns } from './isBulkPatch'
import {
  selectColumnsOfTableOrTableView,
  rebuildData,
} from './selectColumnsOfTableOrView.hook'

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [
      // commonHooks.iff(
      //   (context: HookContext) => {
      //     return commonHooks.isProvider('external')(context) && !queryContainsKeys(['$lckGroupId'])(context)
      //   }, // records are available only through a group
      //   commonHooks.disallow(),
      // ),
      commonHooks.iffElse(
        queryContainsKeys(['table_id', 'table_view_id', 'id']),
        [
          loadColumnsDefinition(),
          commonHooks.disablePagination(),
          filterRowsByTableViewId(),
          commonHooks.discardQuery('table_view_id'),
          commonHooks.discardQuery('rowId'),
          selectColumnsOfTableOrTableView(),
          commonHooks.discardQuery('$lckGroupId'),
        ],
        commonHooks.disallow(),
      ),
    ],
    get: [
      // commonHooks.iff(
      //   (context: HookContext) => {
      //     return commonHooks.isProvider('external')(context) && !queryContainsKeys(['$lckGroupId'])(context)
      //   }, // records are available only through a group
      //   commonHooks.disallow(),
      // ),
    ],
    create: [
      // commonHooks.iff(
      //   (context: HookContext) => {
      //     return commonHooks.isProvider('external')(context) &&
      //     !(context.data.$lckGroupId !== null && context.data.$lckGroupId !== undefined)
      //   }, // records are available only through a group
      //   commonHooks.disallow(),
      // ),
      // commonHooks.required(...TableRow.jsonSchema.required as string[]),
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      checkColumnDefinitionMatching(),
      commonHooks.iff(isDataSent, enhanceComplexColumns()),
      computeRowLookedUpColumns(),
      completeDefaultValues(),
      computeTextProperty(),
    ],
    update: [
      // commonHooks.iff(
      //   (context: HookContext) => {
      //     return commonHooks.isProvider('external')(context) &&
      //     !(context.data.$lckGroupId !== null && context.data.$lckGroupId !== undefined)
      //   }, // records are available only through a group
      //   commonHooks.disallow(),
      // ),
      getCurrentItem(),
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      checkColumnDefinitionMatching(),
      commonHooks.iff(isDataSent, enhanceComplexColumns()),
      computeRowLookedUpColumns(),
      completeDefaultValues(),
      computeTextProperty(),
    ],
    patch: [
      // commonHooks.iff(
      //   (context: HookContext) => {
      //     return commonHooks.isProvider('external')(context) &&
      //     !(context.data.$lckGroupId !== null && context.data.$lckGroupId !== undefined)
      //   }, // records are available only through a group
      //   commonHooks.disallow(),
      // ),
      commonHooks.iffElse(
        isBulkPatch,
        [
          commonHooks.iffElse(
            isValidBulkPatch,
            [
              memorizeColumnsIds(),
              loadUpdatedColumnsWithChildren(),
              commonHooks.iffElse(
                onlyUpdateFormulaColumns,
                [],
                [commonHooks.disallow()],
              ),
            ],
            commonHooks.disallow(),
          ),
        ],
        [
          getCurrentItem(),
          loadColumnsDefinition(),
          memorizeColumnsIds(),
          checkColumnDefinitionMatching(),
          commonHooks.iff(isDataSent, enhanceComplexColumns()),
          completeDataField(),
          computeRowLookedUpColumns(),
          computeTextProperty(),
        ],
      ),
    ],
    remove: [
      // commonHooks.iff(
      //   (context: HookContext) => {
      //     return commonHooks.isProvider('external')(context) &&
      //     !(context.data.$lckGroupId !== null && context.data.$lckGroupId !== undefined)
      //   }, // records are available only through a group
      //   commonHooks.disallow(),
      // ),
      restrictRemoveIfRelatedRows(),
      removeRelatedExecutions(),
      removeRelatedRows(),
    ],
  },

  after: {
    all: [
      // historizeDataEvents()
    ],
    find: [
      rebuildData(),
    ],
    get: [
    ],
    create: [
      upsertRowRelation(),
      computeRowFormulaColumns(),
      computeLookedUpColumns(),
      triggerProcess,
    ],
    update: [
      upsertRowRelation(),
      computeRowFormulaColumns(),
      computeLookedUpColumns(),
      triggerProcess,
    ],
    patch: [
      upsertRowRelation(),
      computeRowFormulaColumns(),
      computeLookedUpColumns(),
      triggerProcess,
    ],
    remove: [
      triggerProcess,
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
