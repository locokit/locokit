
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
import { shrinkRecordsData } from './shrinkRecordsData.hook'
import { defineAbilitiesIffHook } from '../../abilities/record.abilities'
import { authorize } from 'feathers-casl/dist/hooks'

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [
      commonHooks.iffElse(
        queryContainsKeys(['table_id', 'table_view_id', 'id']),
        [
          loadColumnsDefinition(),
          commonHooks.disablePagination(),
          filterRowsByTableViewId(),
          commonHooks.discardQuery('table_view_id'),
          commonHooks.discardQuery('rowId'),
          // selectColumnsOfTableOrTableView(),
          defineAbilitiesIffHook(),
          commonHooks.discardQuery('$lckGroupId'),
          authorize({
            adapter: 'feathers-objection',
          }),
        ],
        commonHooks.disallow(),
      ),
    ],
    get: [
      /**
       * TODO: permissions,
       * load the current row,
       * filter permissions for a table
       */
      commonHooks.discardQuery('$lckGroupId'), // remove the $lckGroupId (used to compute abilities)
    ],
    create: [
      // commonHooks.required(...TableRow.jsonSchema.required as string[]),
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      checkColumnDefinitionMatching(),
      commonHooks.iff(isDataSent, enhanceComplexColumns()),
      completeDefaultValues(),
      computeRowLookedUpColumns(),
      computeTextProperty(),
      commonHooks.discard('table_view_id'),
      defineAbilitiesIffHook(),
      commonHooks.discard('$lckGroupId'),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    update: [
      getCurrentItem(),
      loadColumnsDefinition(),
      memorizeColumnsIds(),
      checkColumnDefinitionMatching(),
      commonHooks.iff(isDataSent, enhanceComplexColumns()),
      computeRowLookedUpColumns(),
      completeDefaultValues(),
      computeTextProperty(),
      commonHooks.discard('table_view_id'),
      defineAbilitiesIffHook(),
      commonHooks.discard('$lckGroupId'),
      authorize({
        adapter: 'feathers-objection',
      }),
    ],
    patch: [
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
          commonHooks.discard('table_view_id'),
          defineAbilitiesIffHook(),
          commonHooks.discard('$lckGroupId'),
          authorize({
            adapter: 'feathers-objection',
          }),
        ],
      ),
    ],
    remove: [
      restrictRemoveIfRelatedRows(),
      removeRelatedExecutions(),
      removeRelatedRows(),
    ],
  },

  after: {
    all: [
      // beware, the authorize hook don't really work for us
      // we have filters based on nested props, it seems this is not working
      // so we filter with shrinkRecordsData if needed
      // authorize({
      //   adapter: 'feathers-objection',
      //   availableFields: ['id', 'text', 'data', 'createdAt', 'updatedAt'],
      // }),
      // historizeDataEvents()
    ],
    find: [
      shrinkRecordsData(),
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
