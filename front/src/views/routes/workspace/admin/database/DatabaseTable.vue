<template>
  <div class="p-d-flex p-flex-column d-flex-1 o-auto h-full">
    <div
      v-if="database && database.tables.length > 0"
      class="p-d-flex p-flex-column d-flex-1 o-auto"
    >
      <div class="p-d-flex d-flex-1 o-auto">
        <layout-with-toolbar class="p-d-flex p-flex-column d-flex-1 o-auto">
          <div
            class="lck-database-background"
            :style="`background-image: url(${PAGE_DATABASE_BACKGROUND_IMAGE_URL})`"
          />

          <template #toolbar>
            <div class="p-d-flex p-flex-wrap">
              <lck-view-button
                :views="views"
                v-model="selectedViewId"
                @create="onCreateView"
                @update="onUpdateView"
                @confirm="onConfirmationView"
                @reorder="onReorderView"
                @input="onSelectView"
              />

              <lck-view-dialog
                :visible="displayViewDialog"
                :value="viewDialogData"
                @close="displayViewDialog=false"
                @input="saveView"
              />

              <lck-view-column-button
                class="p-ml-2"
                :columns="block.definition.columns"
                :value="viewColumnsIds"
                :disabled="currentView && currentView.locked"
                @change="onChangeViewColumns"
              />
              <lck-filter-button
                class="p-ml-2"
                :definition="displayColumnsView"
                :columnsDropdownOptions="currentBlockDropdownOptions"
                :crudMode="crudMode"
                v-model="currentDatatableFilters"
                :disabled="!hasDataToDisplay && currentDatatableFilters.length === 0"
                :locked="currentView && currentView.locked"
                @submit="onSubmitFilter"
                @reset="onResetFilter"
                @save-filters="onSaveFilters"
              />

            </div>

            <div class="p-d-flex p-flex-wrap">
              <p-button
                :label="$t('form.add')"
                icon="bi bi-plus-circle"
                class="p-mr-2 p-button-text p-button-primary"
                @click="onClickAddButton"
              />
              <lck-dropdown-button
                :label="$t('components.datatable.toolbar.export.label')"
                :disabled="!hasDataToDisplay"
                :icon="exporting ? 'pi pi-spin pi-spinner' : 'pi pi-download'"
                :model="fileExportFormat"
                buttonClass="p-button-secondary"
              />
            </div>
          </template>

          <lck-datatable
            v-if="block.definition"
            :actions="avalaibleActions"
            :definition="displayColumnsView"
            :content="block.content"
            :loading="block.loading"
            :autocompleteSuggestions="crudAutocompleteItems"
            :rowsNumber="currentDatatableRows"
            :locked="currentView && currentView.locked"
            :crudMode="crudMode"
            :manualProcesses="manualProcesses"
            :displayDetailButton="true"
            :cellState="cellState"
            :columnsSetPrefix="currentView && currentView.id"
            :workspaceId="workspaceId"
            @update-content="onUpdateContent"
            @update-suggestions="updateCRUDAutocompleteSuggestions"
            @update-cell="onUpdateCell"
            @sort="onSort"
            @column-resize="onColumnResize"
            @column-reorder="onColumnReorder"
            @column-select="onColumnSelect"
            @action-column-select="onActionColumnSelect"
            @display-column-sidebar="onDisplayColumnSidebar"
            @table-view-column-edit="onTableViewColumnEdit"
            @row-delete="onRowDelete"
            @row-duplicate="onRowDuplicate"
            @open-detail="onOpenDetail"
            @create-process-run="onTriggerProcess"
            @go-to-page-detail="goToPage"
            @download-attachment="onDownloadAttachment"
            @upload-files="onUploadFiles"
            @remove-attachment="onRemoveAttachment"
          />
        </layout-with-toolbar>

      </div>

      <lck-dialog-form
        :visible.sync="displayNewDialog"
        class="newRowDialogForm"
        :header="$t('pages.database.addNewRow')"
        @close="displayNewDialog = false"
        :submitting="submitting"
        @input="saveRow"
      >
        <lck-data-detail
          :crudMode="crudMode"
          :definition="filteredDefinitionColumns"
          :row="newRow"
          mode="creation"
          :workspaceId="workspaceId"
          :autocompleteSuggestions="autocompleteSuggestions"
          :secondarySources="secondarySources"
          @update-suggestions="updateLocalAutocompleteSuggestions"
          @update-row="onUpdateRow"
          @download-attachment="onDownloadAttachment"
          @upload-files="onUploadFiles($event, newRow)"
          @remove-attachment="onRemoveAttachment($event, newRow)"
          @get-secondary-sources='getSecondarySources'
        />
      </lck-dialog-form>

      <lck-dialog
        :visible.sync="displayRowDialog"
        @close="displayRowDialog = false"
        :header="row.text"
      >
        <lck-data-detail
          :crudMode="crudMode"
          :definition="displayColumnsView"
          :row="row"
          :cellState="cellState"
          :workspaceId="workspaceId"
          :autocompleteSuggestions="autocompleteSuggestions"
          :secondarySources="secondarySources"
          @update-suggestions="updateLocalAutocompleteSuggestions"
          @update-row="onUpdateCell"
          @download-attachment="onDownloadAttachment"
          @upload-files="onUploadFiles"
          @remove-attachment="onRemoveAttachment"
          @get-secondary-sources='getSecondarySources'
        />

        <lck-process-panel
          :processesByRow="processesByRow"
          :rowId="row.id"
          @create-process-run="onTriggerProcess"
          @toggle-process="onUpdateProcessTrigger"
        />
      </lck-dialog>
      <p-sidebar
        position="right"
        class="p-sidebar-md edit-column-sidebar"
        :modal="false"
        :visible.sync="showEditColumnSidebar"
      >
        <lck-column-form
          v-if="currentColumnToEdit"
          :column="currentColumnToEdit"
          :submitting="submitting"
          @column-edit="onColumnEdit"
          @table-view-column-edit="onTableViewColumnEdit"
        />
        <lck-action-column-form
          v-else-if="currentActionColumnToEdit"
          :action="currentActionColumnToEdit"
          :submitting="submitting"
          :manualProcesses="manualProcesses"
          @action-column-edit="onActionColumnEdit"
          :autocompleteSuggestions="autocompleteSuggestions"
          @search-columns-from-table-view="updateTableViewSuggestions"
          @search-page="updatePageSuggestions"
        />
      </p-sidebar>

      <confirm-dialog />
    </div>
    <div v-else>
      {{ $t('pages.database.noDatabase') }}
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import Vue from 'vue'
import ConfirmDialog from 'primevue/confirmdialog'

import { COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  retrieveDatabaseTableAndViewsDefinitions,
  retrieveTableColumns,
  retrieveTableRowsWithSkipAndLimit,
  retrieveTableViews,
} from '@/services/lck-helpers/database'
import {
  createProcessRun,
  patchProcess,
  retrieveManualProcessWithRuns,
  retrieveProcessesByRow,
} from '@/services/lck-helpers/process'
import {
  objectFromArray,
} from '@/services/lck-utils/arrays'
import {
  isEditableColumn,
  getOriginalColumn,
  READ_ONLY_COLUMNS_TYPES,
} from '@/services/lck-utils/columns'
import {
  lckHelpers,
  lckServices,
} from '@/services/lck-api'

import { getCurrentFilters, convertFiltersFromDatabase, convertFiltersToDatatabase } from '@/services/lck-utils/filter'
import { PROCESS_RUN_STATUS } from '@/services/lck-api/definitions'
import { ROUTES_NAMES } from '@/router/paths'

import { authState } from '@/store/auth'

import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'

import DataTable from '@/components/store/DataTable/DataTable.vue'
import ProcessPanel from '@/components/store/ProcessPanel/ProcessPanel.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import ViewButton from '@/components/store/ViewButton/ViewButton.vue'
import ViewDialog from '@/components/store/ViewButton/ViewDialog.vue'
import ViewColumnButton from '@/components/store/ViewColumnButton/ViewColumnButton.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import ColumnForm from '@/components/store/ColumnForm/ColumnForm.vue'
import ActionColumnForm from '@/components/store/ActionColumnForm/ActionColumnForm.vue'
import DropdownButton from '@/components/ui/DropdownButton/DropdownButton.vue'

import WithToolbar from '@/layouts/WithToolbar.vue'

const defaultDatatableSort = {
  createdAt: 1,
}

export default {
  name: 'Database',
  components: {
    'confirm-dialog': ConfirmDialog,
    'lck-datatable': DataTable,
    'lck-filter-button': FilterButton,
    'lck-view-button': ViewButton,
    'lck-view-dialog': ViewDialog,
    'lck-view-column-button': ViewColumnButton,
    'lck-data-detail': DataDetail,
    'lck-process-panel': ProcessPanel,
    'lck-dropdown-button': DropdownButton,
    'lck-dialog': Dialog,
    'lck-dialog-form': DialogForm,
    'lck-column-form': ColumnForm,
    'lck-action-column-form': ActionColumnForm,
    'layout-with-toolbar': WithToolbar,
    'p-button': Vue.extend(Button),
    'p-sidebar': Vue.extend(Sidebar),
  },
  props: {
    databaseId: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: String,
      required: true,
    },
    tableId: {
      type: String,
      required: false,
    },
  },
  data () {
    return {
      // eslint-disable-next-line no-undef
      PAGE_DATABASE_BACKGROUND_IMAGE_URL: LCK_THEME.PAGE_DATABASE_BACKGROUND_IMAGE_URL,
      database: {
        tables: [],
      },
      crudMode: true,
      cellState: {},
      fileExportFormat: [
        {
          label: this.$t('components.datatable.toolbar.export.exportCSV'),
          icon: 'pi pi-file',
          command: () => {
            this.onClickExportButtonCSV()
          },
        },
        {
          label: this.$t('components.datatable.toolbar.export.exportXLS'),
          icon: 'pi pi-file-excel',
          command: () => {
            this.onClickExportButtonXLS()
          },
        },
      ],
      block: {
        loading: false,
        content: {
          total: 0,
          data: null,
        },
        definition: {
          table_id: '',
          columns: [],
        },
      },
      views: [],
      selectedViewId: null,
      displayNewDialog: false,
      newRow: {
        data: {},
      },
      manualProcesses: [],
      processesByRow: [],
      submitting: false,
      exporting: false,
      currentTableId: null,
      currentDatatableFirst: 0,
      currentDatatableRows: 20,
      currentDatatableSort: {
        ...defaultDatatableSort,
      },
      currentDatatableFilters: [],
      currentPageIndex: 0,
      autocompleteSuggestions: null,
      autocompleteInput: {},
      multipleAutocompleteInput: {},
      crudAutocompleteItems: null,
      /**
       * View part, display the dialog and edit data
       */
      displayViewDialog: false,
      viewDialogData: {},
      displayRowDialog: false,
      row: {},
      secondarySources: {},
      // Column part
      currentColumnToEdit: null,
      currentActionColumnToEdit: null,
      showEditColumnSidebar: false,
    }
  },
  computed: {
    /**
     * Available actions for this view
     * @returns {*[]|*}
     */
    avalaibleActions () {
      if (this.views && this.selectedViewId) {
        const view = this.views.find(({ id }) => this.selectedViewId === id)
        return view.actions
      }
      return []
    },
    /**
     * Columns without auto-computed columns in creation of a new row/record
     * @returns {{columns: *}|*[]}
     */
    filteredDefinitionColumns () {
      if (!this.currentView?.columns) return []
      return {
        columns: this.currentView.columns.filter((column) =>
          !READ_ONLY_COLUMNS_TYPES.has(column.column_type_id),
        ),
      }
    },
    /**
     * Sorted columns according to their position in the current view
     * In DataTable and DataRecord
     * @returns {{columns: *}|{columns: *[]}}
     */
    displayColumnsView () {
      if (!this.currentView) return { columns: [] }
      const columns = this.currentView.columns.slice(0).sort((a, b) => a.position - b.position)
      return { columns }
    },
    /**
     * All option information for each SINGLE_SELECT and MULTI_SELECT's column on the current view
     * @returns {{}}
     */
    currentBlockDropdownOptions () {
      const result = {}
      if (!this.currentView) return result
      this.currentView.columns.forEach(currentColumn => {
        const originalColumn = getOriginalColumn(currentColumn)
        if (
          originalColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
          originalColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
        ) {
          result[currentColumn.id] = Object.keys(originalColumn.settings?.values || {}).map(k => ({
            value: k,
            ...originalColumn.settings.values[k],
          }))
        }
      })
      return result
    },
    /**
     * Current view with table_actions and columns
     * @returns {null|*}
     */
    currentView () {
      if (!this.selectedViewId) return null
      return this.views.find(({ id }) => this.selectedViewId === id)
    },
    /**
     * All column ids of the current sorted view
     * @returns {*[]|*}
     */
    viewColumnsIds () {
      if (!this.displayColumnsView.columns) return []
      return this.displayColumnsView.columns.map(c => c.id)
    },
    /**
     * Check if data or column available in the current view
     * @returns {boolean}
     */
    hasDataToDisplay () {
      return this.displayColumnsView.columns.length > 0 && this.block?.content?.total > 0
    },
    /**
     * Columns of current view transformed in object where key = id and value = data
     * @returns {Record<string, object>|{}}
     */
    columnsObject () {
      // Get an object containing the columns as values and their ids as keys
      if (!this.currentView?.columns) return {}
      return objectFromArray(this.currentView.columns, 'id')
    },

  },
  methods: {
    isEditableColumn,
    getCurrentFilters (filters) {
      return getCurrentFilters(filters, {
        '{userId}': authState.data.user?.id,
        '{groupId}': this.groupId,
      })
    },
    searchItems: lckHelpers.searchItems,
    searchBooleanColumnsFromTableView: lckHelpers.searchBooleanColumnsFromTableView,
    searchPageWithChapter: lckHelpers.searchPageWithChapter,
    /**
     * Update current row displayed in DataRecord
     */
    async onUpdateRow ({ columnId, newValue }) {
      this.$set(this.newRow.data, columnId, newValue)
    },
    /**
     * Reset specific source from geometry column
     */
    resetSecondarySources (tableViewId = null) {
      if (tableViewId) {
        if (this.secondarySources[tableViewId]) {
          this.secondarySources[tableViewId] = {}
        }
      } else {
        this.secondarySources = {}
      }
    },
    /**
     * Retrieve others view from geometry column
     * For now only Geometry column use it
     */
    async getSecondarySources (tableViewIds) {
      const newSecondarySources = {}
      const tableViewDefinitionsToGet = []
      // Loop on the secondary sources
      tableViewIds.forEach(id => {
        newSecondarySources[id] = {}
        if (this.secondarySources[id]?.definition) {
          // Keep the previous source definition
          newSecondarySources[id].definition = this.secondarySources[id].definition
        } else {
          // Need to get this new definition from the API
          tableViewDefinitionsToGet.push(id)
        }
      })
      if (tableViewDefinitionsToGet.length) {
        // Load the new definitions
        const tableViewDefinitions = await lckHelpers.retrieveViewDefinition(tableViewDefinitionsToGet)
        tableViewDefinitions.forEach(tableViewDefinition => {
          newSecondarySources[tableViewDefinition.id].definition = tableViewDefinition
        })
      }
      // Load the contents
      await Promise.all(tableViewIds.map(async tableViewId => {
        newSecondarySources[tableViewId].content = await lckHelpers.retrieveViewData(tableViewId, null, 0, -1)
      }))
      this.secondarySources = newSecondarySources
    },
    /**
     * Reset all data to default
     */
    resetToDefault () {
      this.block = {
        loading: false,
        content: null,
        definition: {
          columns: [],
        },
      }
      this.views = []
      this.selectedViewId = null
      this.displayNewDialog = false
      this.newRow = {
        data: {},
      }
      this.submitting = false
      this.currentDatatableFirst = 0
      this.currentDatatableRows = 20
      this.currentPageIndex = 0
      this.currentDatatableSort = {
        ...defaultDatatableSort,
      }
      this.currentDatatableFilters = []
      this.resetColumnEdit()
      this.resetSecondarySources()
    },
    /**
     * Retrieve records according to page wanted
     */
    onUpdateContent (pageIndexToGo) {
      this.currentPageIndex = pageIndexToGo
      this.loadCurrentTableData()
    },
    /**
     * Retrieve view with action and column
     */
    async loadTableAndProcess () {
      this.block.loading = true
      this.block.content = {
        total: 0,
        data: null,
      }
      // Legacy: doesn't use anymore
      this.block.definition.table_id = this.currentTableId
      this.block.definition.columns = await retrieveTableColumns(this.currentTableId)

      this.views = await retrieveTableViews(this.currentTableId)
      if (this.views.length > 0) {
        this.selectedViewId = this.views[0].id
        this.currentDatatableFilters = convertFiltersFromDatabase(this.views[0])
      }
      this.block.loading = false
      await this.loadCurrentTableData()
      // Retrieve actions/processes from table
      this.manualProcesses = await retrieveManualProcessWithRuns(this.currentTableId)
    },
    /**
     * Retrieve records according to current page, filters and sort
     */
    async loadCurrentTableData () {
      this.block.loading = true
      this.block.content = await retrieveTableRowsWithSkipAndLimit(
        this.currentTableId,
        null,
        {
          skip: this.currentPageIndex * this.currentDatatableRows,
          limit: this.currentDatatableRows,
          sort: this.currentDatatableSort,
          filters: this.getCurrentFilters(this.currentDatatableFilters),
        },
      )
      lckHelpers.convertDateInRecords(this.block.content.data, this.currentView.columns)
      this.block.loading = false
    },
    /**
     * Update row/records + Send error notification if something wrong
     */
    async saveRow () {
      this.submitting = true
      const data = lckHelpers.formatRowData(this.newRow.data, this.columnsObject)
      try {
        await lckServices.tableRow.create({
          data,
          table_id: this.currentTableId,
        })
        this.displayNewDialog = false
        this.loadCurrentTableData()
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
          detail: this.$t('error.lck.ROW_SAVE'),
          life: 5000,
        })
      } finally {
        this.submitting = false
      }
    },
    /**
     * Transform data and then sort records in this view according to it
     */
    onSort ({ field, order }) {
      this.currentDatatableSort = {
        [`ref(data:${field})`]: order,
      }
      this.loadCurrentTableData()
    },
    /**
     * Apply filters on records in this view
     */
    onSubmitFilter () {
      this.loadCurrentTableData()
    },
    /**
     * Reset filters on records in this view
     */
    onResetFilter () {
      this.currentDatatableFilters = []
      this.loadCurrentTableData()
    },
    /**
     * Apply a permanent filters on records in this view
     */
    async onSaveFilters (hasChanged) {
      if (!this.currentView) return
      if (this.currentView.locked) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.filters.viewIsLocked'),
          detail: this.$t('components.datatable.toolbar.filters.viewIsLocked'),
          life: 5000,
        })
        return
      }
      try {
        const updatedView = await lckServices.tableView.patch(this.currentView.id, {
          filter: hasChanged ? convertFiltersToDatatabase(this.currentDatatableFilters) : null,
        })
        this.$set(this.currentView, 'filter', updatedView.filter)
        this.$toast.add({
          severity: 'success',
          summary: this.$t('success.save'),
          detail: hasChanged
            ? this.$t('components.datatable.toolbar.filters.updateSuccess')
            : this.$t('components.datatable.toolbar.filters.resetSuccess'),
          life: 5000,
        })
      } catch (res) {
        this.$toast.add({
          severity: 'error',
          summary: res.code ? this.$t('error.http.' + res.code) : this.$t('error.basic'),
          detail: this.$t('components.datatable.toolbar.filters.updateError'),
          life: 5000,
        })
      }
    },
    /**
     * Reset and Prepare fields and open modal to create new record
     */
    onClickAddButton () {
      this.newRow = {
        data: {},
      }
      this.currentView.columns.forEach(c => {
        if (
          [COLUMN_TYPE.SINGLE_SELECT, COLUMN_TYPE.BOOLEAN].includes(c.column_type_id) &&
          c.settings?.default
        ) {
          this.$set(this.newRow.data, c.id, c.settings.default)
        }
      })
      this.autocompleteInput = {}
      this.multipleAutocompleteInput = {}
      this.displayNewDialog = true
    },
    /**
     * Export current view according to current filters in CSV
     * Todo: Do the same for sort!
     */
    async onClickExportButtonCSV () {
      if (!this.selectedViewId) return
      this.exporting = true
      await lckHelpers.exportTableRowDataCSV(
        this.selectedViewId,
        this.getCurrentFilters(this.currentDatatableFilters),
        this.fileName = this.currentView.text,
      )
      this.exporting = false
    },
    /**
     * Export current view according to current filters in XLS
     * Todo: Do the same for sort!
     */
    async onClickExportButtonXLS () {
      if (!this.selectedViewId) return
      this.exporting = true
      await lckHelpers.exportTableRowDataXLS(
        this.selectedViewId,
        this.getCurrentFilters(this.currentDatatableFilters),
        this.fileName = this.currentView.text,
      )
      this.exporting = false
    },
    /**
     * Update columns/fields in the current view (CRUD)
     */
    async onChangeViewColumns ({ value }) {
      /**
       * Compute the diff between the new value and the existing columns
       * if we aren't on the complete selectedView
       */
      const updatePromises = []
      // Get the columns to create
      const columnsIdsToAdd = value.filter(v => this.viewColumnsIds.indexOf(v) === -1)
      const keptColumnsNumber = value.length - columnsIdsToAdd.length
      if (columnsIdsToAdd.length > 0) {
        columnsIdsToAdd.forEach((id, index) => updatePromises.push(
          lckServices.tableViewColumn.create({
            table_column_id: id,
            table_view_id: this.selectedViewId,
            position: keptColumnsNumber + index,
            displayed: true,
          }),
        ))
      }

      // Get the columns to remove / update
      let columnsToRemoveNumber = 0
      this.viewColumnsIds.forEach((columnId, index) => {
        if (value.indexOf(columnId) === -1) {
          // Columns to remove
          columnsToRemoveNumber += 1
          updatePromises.push(
            lckServices.tableViewColumn.remove(`${this.selectedViewId},${columnId}`),
          )
          if (this.currentColumnToEdit?.id === columnId) this.resetColumnEdit()
        } else if (columnsToRemoveNumber > 0) {
          // Columns whose the position must be updated (at right of the first deleted column)
          updatePromises.push(
            lckServices.tableViewColumn.patch(`${this.selectedViewId},${columnId}`, {
              position: index - columnsToRemoveNumber,
            }),
          )
        }
      })

      await Promise.all(updatePromises)
      /**
       * Update the view definition
       */
      const newViewDefinition = await lckServices.tableView.get(this.selectedViewId, {
        query: {
          $eager: 'columns.[parents.^]',
        },
      })
      this.$set(
        this.views,
        this.views.findIndex(({ id }) => this.selectedViewId === id),
        newViewDefinition,
      )
      this.resetSecondarySources(this.selectedViewId)
    },
    /**
     * Change the current view with desired one
     */
    async onSelectView () {
      // The current view is updated by v-model
      this.resetColumnEdit()
      // Update the data with the table view filters only if necessary
      if (this.currentView && (this.currentView.filter || this.currentDatatableFilters.length > 0)) {
        this.currentDatatableFilters = convertFiltersFromDatabase(this.currentView)
        await this.loadCurrentTableData()
      }
    },
    /**
     * Reset + Open modal to create new view
     */
    async onCreateView () {
      this.viewDialogData = {}
      this.displayViewDialog = true
    },
    /**
     * Display modal to update view
     */
    async onUpdateView (viewToUpdate) {
      this.viewDialogData = viewToUpdate
      this.displayViewDialog = true
    },
    /**
     * Confirm removal on the selected view
     * And change current view if was the previous one
     * And send notification to user
     */
    async onConfirmationView (viewToRemove) {
      this.$confirm.require({
        message: `${this.$t('form.specificDeleteConfirmation')} ${viewToRemove.text}`,
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await lckServices.tableView.remove(viewToRemove.id)
            this.views = await retrieveTableViews(this.currentTableId)
            /**
             * We change the view if the previous one is the one that has been removed
             */
            if (viewToRemove.id === this.selectedViewId) {
              this.selectedViewId = this.views[0].id
              this.resetColumnEdit()
            }
            this.resetSecondarySources(viewToRemove.id)
            this.$toast.add({
              severity: 'success',
              summary: this.$t('components.processPanel.SUCCESS'),
              detail: this.$t('success.removed'),
              life: 5000,
            })
          } catch (error) {
            this.$toast.add({
              severity: 'error',
              summary: this.$t('components.processPanel.ERROR'),
              detail: this.$t('components.processPanel.failedNewRun'),
              life: 5000,
            })
          }
        },
      })
    },
    /**
     * Update view order in list
     */
    async onReorderView ({ value: views }) {
      this.views = views
      await Promise.all(
        views.map((v, index) => lckServices.tableView.patch(v.id, {
          position: index,
        })),
      )
      this.views = await retrieveTableViews(this.currentTableId)
    },
    /**
     * Create an new view or Update it
     */
    async saveView (view) {
      if (view.id) {
        await lckServices.tableView.patch(view.id, {
          text: view.text,
          locked: view.locked,
        })
        this.views = await retrieveTableViews(this.currentTableId)
        this.resetSecondarySources(view.id)
      } else {
        const newView = await lckServices.tableView.create({
          table_id: this.currentTableId,
          ...view,
        })
        this.views = await retrieveTableViews(this.currentTableId)
        this.selectedViewId = newView.id
        this.resetColumnEdit()
      }
      this.displayViewDialog = false
    },
    /**
     * Update with of selected column in this view
     */
    async onColumnResize (newWidth, columnId) {
      // first, find the column related
      const currentColumn = this.currentView.columns.find(c => c.id === columnId)
      if (!currentColumn) return
      const newColumn = await lckServices.tableViewColumn.patch(
        `${this.selectedViewId},${columnId}`, {
          style: {
            ...currentColumn.style,
            width: newWidth,
          },
        },
      )
      // replace existing definition with new column
      currentColumn.style = newColumn.style
    },
    /**
     * Order columns in this view
     */
    async onColumnReorder ({
      fromIndex,
      toIndex,
    }) {
      const updatePromises = []
      // if from & to indexes are equal, nothing to do => exit
      if (fromIndex === toIndex) return
      // first, patch the moved column
      updatePromises.push(lckServices.tableViewColumn.patch(
        `${this.selectedViewId},${this.viewColumnsIds[fromIndex]}`, {
          position: toIndex,
        }),
      )
      if (fromIndex > toIndex) {
        // if the fromIndex is after the toIndex
        // we need to update all columns after the toIndex, included, fromIndex excluded
        for (let i1 = toIndex; i1 < fromIndex; i1++) {
          updatePromises.push(lckServices.tableViewColumn.patch(
            `${this.selectedViewId},${this.viewColumnsIds[i1]}`, {
              position: i1 + 1,
            }),
          )
        }
      } else {
        // if not,
        // we need to update all columns between fromIndex and toIndex, fromIndex excluded
        for (let i2 = fromIndex + 1; i2 <= toIndex; i2++) {
          updatePromises.push(lckServices.tableViewColumn.patch(
            `${this.selectedViewId},${this.viewColumnsIds[i2]}`, {
              position: i2 - 1,
            }),
          )
        }
      }
      await Promise.all(updatePromises)
      this.views = await retrieveTableViews(this.currentTableId)
    },
    /**
     * Update column properties in this table
     * And update this information for each view using it
     * And send error notification if something wrong
     */
    async onColumnEdit (editedColumnData) {
      this.submitting = true
      if (this.currentColumnToEdit?.id) {
        try {
          // API request
          const updatedColumn = await lckServices.tableColumn.patch(
            this.currentColumnToEdit.id,
            editedColumnData,
          )
          // Update the table column
          if (Array.isArray(this.block?.definition?.columns)) {
            const localTableColumnIndex = this.currentView.columns.findIndex(
              column => column.id === this.currentColumnToEdit.id,
            )
            this.currentView.columns.splice(localTableColumnIndex, 1, updatedColumn)
          }
          // Update the column of each table view of the table
          this.views.forEach(view => {
            const currentTableViewColumn = view.columns.find(column => column.id === this.currentColumnToEdit.id)
            for (const key in updatedColumn) {
              this.$set(currentTableViewColumn, key, updatedColumn[key])
            }
          })
          this.resetSecondarySources()
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: this.currentColumnToEdit.text,
            detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
            life: 5000,
          })
        } finally {
          this.submitting = false
        }
      }
    },
    /**
     * Update column action on this view
     * And send error notification if something wrong
     */
    async onActionColumnEdit (dataForm) {
      this.submitting = true
      if (this.currentActionColumnToEdit.id) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, createdAt, updatedAt, type_page_to, ...data } = dataForm
          const updatedActionColumn = await lckServices.tableAction.patch(
            id,
            data,
          )
          // Update the column of each table view of the table
          this.views.forEach(view => {
            const currentTableViewAction = view.actions.find(action => action.id === id)
            if (currentTableViewAction) {
              for (const key in updatedActionColumn) {
                if (currentTableViewAction[key] == null && updatedActionColumn[key] != null) this.$set(currentTableViewAction, key, updatedActionColumn[key])
                else currentTableViewAction[key] = updatedActionColumn[key]
              }
            }
          })
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: this.currentActionColumnToEdit.label,
            detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
            life: 5000,
          })
        } finally {
          this.submitting = false
        }
      }
    },
    /**
     * Open menu to select a functionality (update column, sort…)
     */
    onColumnSelect (selectedColumn) {
      this.currentColumnToEdit = selectedColumn
      this.showEditColumnSidebar = false
    },
    /**
     * Open modal to update table action configuration
     */
    onActionColumnSelect (action) {
      this.currentActionColumnToEdit = action
      this.currentColumnToEdit = null
      this.showEditColumnSidebar = false
    },
    /**
     * Open sidebar to update current column information
     */
    onDisplayColumnSidebar () {
      this.showEditColumnSidebar = true
    },
    /**
     * Reset column information and Close sidebar
     */
    resetColumnEdit () {
      this.currentColumnToEdit = null
      this.showEditColumnSidebar = false
    },
    /**
     * Update column properties in this view
     * And send error notification if something wrong
     */
    async onTableViewColumnEdit (editedColumn) {
      this.submitting = true
      if (this.currentColumnToEdit?.id) {
        try {
          // Update table view column
          const updatedColumn = await lckServices.tableViewColumn.patch(
            `${this.selectedViewId},${this.currentColumnToEdit.id}`,
            editedColumn,
          )
          for (const key in updatedColumn) {
            if (this.currentColumnToEdit[key] == null && updatedColumn[key] != null) this.$set(this.currentColumnToEdit, key, updatedColumn[key])
            else this.currentColumnToEdit[key] = updatedColumn[key]
          }
          this.resetSecondarySources(this.selectedViewId)
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: this.currentColumnToEdit.text,
            detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
            life: 5000,
          })
        } finally {
          this.submitting = false
        }
      }
    },
    /**
     * Delete a record + Send error notification if something wrong
     */
    async onRowDelete (row) {
      try {
        await lckServices.tableRow.remove(row.id)
        this.loadCurrentTableData()
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
          detail: this.$t('error.lck.ROW_DELETION'),
          life: 5000,
        })
      }
    },
    /**
     * Duplicate a record + Send error notification if something wrong
     */
    async onRowDuplicate ({ data }) {
      const duplicatedData = lckHelpers.formatRowData(data, this.columnsObject, true)
      try {
        await lckServices.tableRow.create({ data: duplicatedData, table_id: this.currentTableId })
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
          detail: this.$t('error.lck.ROW_DUPLICATE'),
          life: 5000,
        })
      }
      this.loadCurrentTableData()
    },
    /**
     * Open modal to visualise or edit this record
     * Retrieve information on selected record
     */
    async onOpenDetail ({ rowId }) {
      this.displayRowDialog = true
      this.row = await this.block.content.data.find(({ id }) => id === rowId)
      this.processesByRow = await retrieveProcessesByRow(this.currentTableId, rowId)
    },
    /**
     * Search available views
     */
    async updateTableViewSuggestions ({ query }) {
      this.autocompleteSuggestions = await this.searchBooleanColumnsFromTableView(query, this.selectedViewId)
    },
    /**
     * Search available pages
     */
    async updatePageSuggestions ({ query, filters }) {
      this.autocompleteSuggestions = await this.searchPageWithChapter(query, filters)
    },
    /**
     * Search item
     */
    async updateLocalAutocompleteSuggestions ({ columnTypeId, settings, filter }, { query }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId,
        tableId: settings?.tableId,
        query,
        groupId: null,
        filter,
      })
    },
    /**
     * Search item
     */
    async updateCRUDAutocompleteSuggestions ({ columnTypeId, settings, filter }, { query }) {
      this.crudAutocompleteItems = await this.searchItems({
        columnTypeId,
        tableId: settings?.tableId,
        query,
        groupId: null,
        filter,
      })
    },
    /**
     * Update a cell from record + Send error notification if something wrong
     */
    async onUpdateCell ({ rowId, columnId, newValue }) {
      const currentRow = this.block.content.data.find(({ id }) => id === rowId)
      this.cellState = {
        rowId: currentRow.id,
        columnId,
        waiting: true,
        isValid: false, // don't know if we have to set to false or null
      }

      const data = lckHelpers.formatRowData({ [columnId]: newValue }, this.columnsObject)

      try {
        const res = await lckServices.tableRow.patch(currentRow.id, {
          data,
        })
        this.cellState.isValid = true
        lckHelpers.convertDateInRecords(res, this.currentView.columns)
        currentRow.text = res.text
        currentRow.data = res.data
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
          detail: this.$t('error.lck.ROW_SAVE'),
          life: 5000,
        })
        this.cellState.isValid = false
      }
      this.cellState.waiting = false
    },
    /**
     * Enable or Disable a process on this table
     */
    async onUpdateProcessTrigger ({ processId, enabled }) {
      const res = await patchProcess(processId, { enabled })
      const indexProcessRow = this.processesByRow.findIndex(process => process.id === processId)
      if (res && indexProcessRow >= 0) {
        this.processesByRow[indexProcessRow].enabled = res.enabled
      }
    },
    /**
     * Trigger selected process + Send notification
     */
    async onTriggerProcess ({ rowId, processId, name }) {
      const res = await createProcessRun({
        table_row_id: rowId,
        process_id: processId,
        waitForOutput: true,
      })
      this.$toast.add({
        severity: 'success',
        summary: name,
        detail: this.$t('components.processPanel.started'),
        life: 5000,
      })
      if (res && (res.code || res.status === PROCESS_RUN_STATUS.ERROR)) {
        this.$toast.add({
          severity: 'error',
          summary: name || this.$t('components.processPanel.failedNewRun'),
          detail: res.code ? this.$t('error.http.' + res.code) : this.$t('error.basic'),
          life: 5000,
        })
      } else {
        this.$toast.add({
          severity: 'success',
          summary: name,
          detail: this.$t('components.processPanel.successNewRun'),
          life: 5000,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { process: useless, ...rest } = res

        // Add execution when event is triggered in datatable to check if the trigger must be disabled
        const indexManualProcess = this.manualProcesses.findIndex(process => process.id === processId)
        if (indexManualProcess >= 0) {
          this.manualProcesses[indexManualProcess].runs = [rest, ...this.manualProcesses[indexManualProcess].runs]
        }
        // Add/Update execution when event is triggered in the processPanel
        const indexProcessRow = this.processesByRow.findIndex(process => process.id === processId)
        if (indexProcessRow >= 0) {
          this.processesByRow[indexProcessRow].runs = [rest, ...this.processesByRow[indexProcessRow].runs]
        }
      }
    },
    /**
     * Send notification to inform expected behavior to the administrator
     * This feature is not available on Database (only for Visu)
     */
    async goToPage () {
      this.$toast.add({
        severity: 'info',
        summary: this.$t('components.datatable.notifWarningRedirectionAction.summary'),
        detail: this.$t('components.datatable.notifWarningRedirectionAction.detail'),
        life: 5000,
      })
    },
    /**
     * Add new file for this record
     */
    async onUploadFiles ({ rowId, columnId, fileList }, newRow) {
      const currentRow = newRow || this.block.content.data.find(({ id }) => id === rowId)
      this.cellState = {
        rowId,
        columnId,
        waiting: true,
        isValid: false, // don't know if we have to set to false or null
      }

      try {
        const newUploadedFiles = await lckHelpers.uploadMultipleFiles(fileList, this.workspaceId)
        /**
         * Here we need to know if we are in a creation or in a row update
         */
        if (newRow) {
          if (!currentRow.data[columnId]) this.$set(currentRow.data, columnId, [])
          currentRow.data[columnId].push(...newUploadedFiles)
          this.cellState.isValid = true
        } else {
          const newDataFiles = currentRow.data[columnId]?.map(a => a.id) || []
          newDataFiles.push(...newUploadedFiles.map(u => u.id))

          /**
           * Need to update the data with the new files uploaded + the old files
           */
          const res = await lckServices.tableRow.patch(currentRow.id, {
            data: {
              [columnId]: newDataFiles,
            },
          })
          this.cellState.isValid = true
          lckHelpers.convertDateInRecords(res, this.currentView.columns)
          currentRow.data = res.data
        }
      } catch (error) {
        this.cellState.isValid = false
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: error.message,
          life: 5000,
        })
      }
      this.cellState.waiting = false
    },
    /**
     * Remove an attachment
     * The file is still available in S3
     */
    async onRemoveAttachment ({ rowId, columnId, attachmentId }, newRow) {
      this.cellState = {
        rowId,
        columnId,
        waiting: true,
        isValid: false, // don't know if we have to set to false or null
      }

      // Here we need to know if we are in a creation or in a row update
      if (newRow) {
        // Row creation -> only update local data
        if (!Array.isArray(newRow.data[columnId])) {
          this.$set(newRow.data, columnId, [])
        } else {
          const deletedAttachmentIndex = newRow.data[columnId].findIndex(a => a.id === attachmentId)
          if (deletedAttachmentIndex >= 0) newRow.data[columnId].splice(deletedAttachmentIndex, 1)
        }
        this.cellState.isValid = true
      } else {
        // Row update -> update database and local data
        try {
          const currentRow = this.block.content.data.find(({ id }) => id === rowId)
          const newDataFiles = currentRow.data[columnId]?.filter(a => a.id !== attachmentId).map(a => a.id) || []
          const res = await lckServices.tableRow.patch(currentRow.id, {
            data: {
              [columnId]: newDataFiles,
            },
          })
          this.cellState.isValid = true
          lckHelpers.convertDateInRecords(res, this.currentView.columns)
          currentRow.data = res.data
        } catch (error) {
          this.cellState.isValid = false
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error.http.' + error.code),
            detail: error.message,
            life: 5000,
          })
        }
      }
      this.cellState.waiting = false
    },
    /**
     * Download an attachment
     */
    async onDownloadAttachment ({ url, filename, mime }) {
      lckHelpers.downloadAttachment(url, filename, mime)
    },
    /**
     * Navigate to another table
     */
    async goToSpecificTable (tableId) {
      // Go to another table page
      await this.$router.replace({
        name: ROUTES_NAMES.WORKSPACE_ADMIN.DATABASETABLE,
        params: {
          workspaceId: this.workspaceId,
          databaseId: this.databaseId,
          tableId: tableId,
        },
      }).catch(error => {
        if (error.from.path !== error.to.path) throw error
      })
    },
  },
  async mounted () {
    this.database = await retrieveDatabaseTableAndViewsDefinitions(this.databaseId)
    // load the table whose id is in the url (or the first one if no one is specified)
    if (this.database.tables.length > 0) {
      this.currentTableId = this.tableId || this.database.tables[0].id
      this.goToSpecificTable(this.currentTableId)
      this.loadTableAndProcess()
    }
  },
  async beforeRouteUpdate (to, from, next) {
    // Load the data related to the table whose id is specified in the url
    if (to.params.tableId !== from.params.tableId) {
      this.currentTableId = to.params.tableId
      this.resetToDefault()
      this.loadTableAndProcess()
      next()
    }
  },
}
</script>

<style scoped>
.lck-database-background {
  content: "";
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.1;
  pointer-events: none;
}

.lck-database-toolbar {
  border-bottom: 1px solid var(--secondary-color-lighten);
  background-color: var(--color-white);
}

.lck-database-panel .lck-toolbar {
  color: var(--primary-color);
}

.lck-database-panel {
  background-color: white;
  width: 30rem;
  border-left: 1px solid var(--header-border-bottom-color);
}

.edit-column-sidebar {
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  min-width: 350px;
}

::v-deep .lck-database-panel .lck-toolbar {
  background-color: var(--primary-color) !important;
  color: #fff;
}

::v-deep .lck-database-panel .lck-toolbar .p-button-primary {
  background-color: rgba(255, 255, 255, 0.8);
}

::v-deep .lck-database-panel .lck-toolbar .p-button-primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
}
.process-toolbar-button {
  margin-top: 0.3rem;
}

@media only screen and (max-device-width: 480px) {
  ::v-deep .p-button .p-button-icon-left {
    margin-right: 0;
  }
  ::v-deep .p-button .p-button-icon-right {
    margin-left: 0;
  }
  ::v-deep .p-button .p-button-label {
    display: none;
  }
}
</style>
