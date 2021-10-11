<template>
  <div class="p-d-flex p-flex-column d-flex-1 o-auto">
    <div
      v-if="database && database.tables.length > 0"
      class="p-d-flex p-flex-column d-flex-1 o-auto"
    >
      <div class="p-d-flex p-jc-between o-auto lck-database-nav">
        <div class="lck-table-links p-d-flex p-flex-row p-mt-2 o-auto">
          <router-link
            v-for="table in database.tables"
            class=""
            :key="table.id"
            :to="{
              name: DATABASE_ROUTE,
              params: {
                groupId: groupId,
                databaseId : databaseId,
                tableId: table.id,
              }
            }"
          >
          {{ table.text}}
        </router-link>
        </div>
        <div class="p-d-flex p-as-start process-toolbar-button">
          <p-button
            :label="$t('pages.process.titleButton')"
            class="p-button-sm p-button-primary p-m-1 p-p-1"
            icon="pi pi-th-large"
            :class="{
              'p-button-text': !displayPanel
            }"
            @click="displayPanel = !displayPanel"
          />
        </div>
      </div>

      <div class="p-d-flex d-flex-1 o-auto">
        <layout-with-toolbar
          class="p-d-flex p-flex-column d-flex-1 o-auto"
        >
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
                @delete="onDeleteView"
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
                @submit="onSubmitFilter"
                @reset="onResetFilter"
                @save-filter="onSaveFilter"
              />

            </div>

            <div class="p-d-flex p-flex-wrap">
              <p-button
                :label="$t('form.add')"
                icon="pi pi-plus-circle"
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

        <div
          class="lck-database-panel"
          v-if="displayPanel"
        >
          <lck-process-listing
            :workspaceId="workspaceId"
            :tableId="currentTableId"
            display-mode="BY_TABLE"
          />
        </div>
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
          :definition="block.definition"
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
    </div>
    <div v-else>
      {{ $t('pages.database.noDatabase') }}
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import Vue from 'vue'

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

import ProcessListing from '@/views/routes/workspace/admin/process/ProcessListing.vue'

const defaultDatatableSort = {
  createdAt: 1,
}

export default {
  name: 'Database',
  components: {
    'lck-datatable': DataTable,
    'lck-filter-button': FilterButton,
    'lck-view-button': ViewButton,
    'lck-view-dialog': ViewDialog,
    'lck-view-column-button': ViewColumnButton,
    'lck-data-detail': DataDetail,
    'lck-process-panel': ProcessPanel,
    'lck-process-listing': ProcessListing,
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
    groupId: {
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
      DATABASE_ROUTE: ROUTES_NAMES.DATABASE,
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
      displayPanel: false,
      secondarySources: {},
      // Column part
      currentColumnToEdit: null,
      currentActionColumnToEdit: null,
      showEditColumnSidebar: false,
    }
  },
  computed: {
    avalaibleActions () {
      if (this.views && this.selectedViewId) {
        const view = this.views.find(({ id }) => this.selectedViewId === id)
        return view.actions
      }
      return []
    },
    filteredDefinitionColumns () {
      if (!this.block.definition.columns) return []
      return {
        columns: this.block.definition.columns.filter((column) =>
          !READ_ONLY_COLUMNS_TYPES.has(column.column_type_id),
        ),
      }
    },
    currentBlockDropdownOptions () {
      const result = {}
      this.block.definition.columns.forEach(currentColumn => {
        const originalColumn = getOriginalColumn(currentColumn)
        if (
          originalColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
          originalColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
        ) {
          result[currentColumn.id] = Object.keys(originalColumn.settings?.values || {}).map(k => ({
            value: k,
            label: originalColumn.settings.values[k].label,
          }))
        }
      })
      return result
    },
    editableColumns () {
      if (!this.block.definition.columns) return []
      return this.block.definition.columns.filter(c => this.isEditableColumn(this.crudMode, c))
    },
    currentView () {
      if (!this.selectedViewId) return null
      return this.views.find(({ id }) => this.selectedViewId === id)
    },
    displayColumnsView () {
      if (!this.currentView) return { columns: [] }
      const columns = this.currentView.columns.slice(0).sort((a, b) => a.position - b.position)
      return { columns }
    },
    viewColumnsIds () {
      if (!this.displayColumnsView.columns) return {}
      return this.displayColumnsView.columns.map(c => c.id)
    },
    hasDataToDisplay () {
      return this.displayColumnsView.columns.length > 0 && this.block?.content?.total > 0
    },
    workspaceId () {
      if (!this.database) return null
      return this.database.workspace_id
    },
    columnsObject () {
      // Get an object containing the columns as values and their ids as keys
      if (!this.block.definition.columns) return {}
      return objectFromArray(this.block.definition.columns, 'id')
    },

  },
  methods: {
    isEditableColumn,
    getCurrentFilters,
    searchItems: lckHelpers.searchItems,
    searchBooleanColumnsFromTableView: lckHelpers.searchBooleanColumnsFromTableView,
    searchPageWithChapter: lckHelpers.searchPageWithChapter,
    async onUpdateRow ({ columnId, newValue }) {
      this.$set(this.newRow.data, columnId, newValue)
    },
    resetSecondarySources (tableViewId = null) {
      if (tableViewId) {
        if (this.secondarySources[tableViewId]) {
          this.secondarySources[tableViewId] = {}
        }
      } else {
        this.secondarySources = {}
      }
    },
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
        newSecondarySources[tableViewId].content = await lckHelpers.retrieveViewData(tableViewId, this.groupId, 0, -1)
      }))
      this.secondarySources = newSecondarySources
    },
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
    onUpdateContent (pageIndexToGo) {
      this.currentPageIndex = pageIndexToGo
      this.loadCurrentTableData()
    },
    async loadTableAndProcess () {
      this.block.loading = true
      this.block.content = {
        total: 0,
        data: null,
      }
      this.block.definition.table_id = this.currentTableId
      this.block.definition.columns = await retrieveTableColumns(this.currentTableId)
      this.views = await retrieveTableViews(this.currentTableId)
      if (this.views.length > 0) {
        this.selectedViewId = this.views[0].id
        this.currentDatatableFilters = convertFiltersFromDatabase(this.views[0])
      }
      this.block.loading = false
      await this.loadCurrentTableData()
      this.manualProcesses = await retrieveManualProcessWithRuns(this.currentTableId)
    },
    async loadCurrentTableData () {
      this.block.loading = true
      this.block.content = await retrieveTableRowsWithSkipAndLimit(
        this.currentTableId,
        this.groupId,
        {
          skip: this.currentPageIndex * this.currentDatatableRows,
          limit: this.currentDatatableRows,
          sort: this.currentDatatableSort,
          filters: this.getCurrentFilters(this.currentDatatableFilters),
        },
      )
      lckHelpers.convertDateInRecords(this.block.content.data, this.block.definition.columns)
      this.block.loading = false
    },
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
    onSort ({ field, order }) {
      this.currentDatatableSort = {
        [`ref(data:${field})`]: order,
      }
      this.loadCurrentTableData()
    },
    onSubmitFilter () {
      this.loadCurrentTableData()
    },
    onResetFilter () {
      this.currentDatatableFilters = []
      this.loadCurrentTableData()
    },
    async onSaveFilter () {
      if (!this.currentView) return
      try {
        const updatedView = await lckServices.tableView.patch(this.currentView.id, {
          filter: convertFiltersToDatatabase(this.currentDatatableFilters),
        })
        this.currentView.filter = updatedView.filter
        this.$toast.add({
          severity: 'success',
          summary: this.$t('success.save'),
          detail: this.currentView.filter
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
    onClickAddButton () {
      this.newRow = {
        data: {},
      }
      this.block.definition.columns.forEach(c => {
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
    async onClickExportButtonCSV () {
      if (!this.selectedViewId) return
      this.exporting = true
      await lckHelpers.exportTableRowDataCSV(
        this.selectedViewId,
        this.getCurrentFilters(this.currentDatatableFilters),
        this.fileName = this.currentView.text,
        this.groupId,
      )
      this.exporting = false
    },
    async onClickExportButtonXLS () {
      if (!this.selectedViewId) return
      this.exporting = true
      await lckHelpers.exportTableRowDataXLS(
        this.selectedViewId,
        this.getCurrentFilters(this.currentDatatableFilters),
        this.fileName = this.currentView.text,
        this.groupId,
      )
      this.exporting = false
    },
    /**
     * When the user update the column's listing of the current view,
     * we update accordingly the view on the backend side (add/remove column in the view)
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
    async onSelectView () {
      this.resetColumnEdit()
      // Update the data with the table view filters only if necessary
      if (this.currentView && (this.currentView.filter || this.currentDatatableFilters.length > 0)) {
        this.currentDatatableFilters = convertFiltersFromDatabase(this.currentView)
        await this.loadCurrentTableData()
      }
    },
    async onCreateView () {
      this.viewDialogData = {}
      this.displayViewDialog = true
    },
    async onUpdateView (viewToUpdate) {
      this.viewDialogData = viewToUpdate
      this.displayViewDialog = true
    },
    async onDeleteView (viewToRemove) {
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
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.lck.' + error.data?.code),
          life: 5000,
        })
      }
    },
    async onReorderView ({ value: views }) {
      this.views = views
      await Promise.all(
        views.map((v, index) => lckServices.tableView.patch(v.id, {
          position: index,
        })),
      )
      this.views = await retrieveTableViews(this.currentTableId)
    },
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
    async onColumnResize (newWidth, columnId) {
      // first, find the column related
      const currentColumn = this.block.definition.columns.find(c => c.id === columnId)
      if (!currentColumn) return
      const newColumn = await lckServices.tableViewColumn.patch(
        `${this.selectedViewId},${columnId}`, {
          style: {
            ...currentColumn.style,
            width: newWidth,
          },
        })
      // replace existing definition with new column
      currentColumn.style = newColumn.style
    },
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
            const tableColumnData = this.block.definition.columns.find(column => column.id === this.currentColumnToEdit.id)
            for (const key in tableColumnData) {
              if (tableColumnData[key] == null && updatedColumn[key] != null) this.$set(tableColumnData, key, updatedColumn[key])
              else tableColumnData[key] = updatedColumn[key]
            }
          }
          // Update the column of each table view of the table
          this.views.forEach(view => {
            const currentTableViewColumn = view.columns.find(column => column.id === this.currentColumnToEdit.id)
            for (const key in updatedColumn) {
              if (currentTableViewColumn[key] == null && updatedColumn[key] != null) this.$set(currentTableViewColumn, key, updatedColumn[key])
              else currentTableViewColumn[key] = updatedColumn[key]
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
    onColumnSelect (selectedColumn) {
      this.currentColumnToEdit = selectedColumn
      this.currentAction = null
      this.showEditColumnSidebar = false
    },
    onActionColumnSelect (action) {
      this.currentActionColumnToEdit = action
      this.currentColumnToEdit = null
      this.showEditColumnSidebar = false
    },
    onDisplayColumnSidebar () {
      this.showEditColumnSidebar = true
    },
    resetColumnEdit () {
      this.currentColumnToEdit = null
      this.showEditColumnSidebar = false
    },
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
    async onOpenDetail ({ rowId }) {
      this.displayRowDialog = true
      this.row = await this.block.content.data.find(({ id }) => id === rowId)
      this.processesByRow = await retrieveProcessesByRow(this.currentTableId, rowId)
    },
    async updateTableViewSuggestions ({ query }) {
      this.autocompleteSuggestions = await this.searchBooleanColumnsFromTableView(query, this.selectedViewId)
    },
    async updatePageSuggestions ({ query, filters }) {
      this.autocompleteSuggestions = await this.searchPageWithChapter(query, filters)
    },
    async updateLocalAutocompleteSuggestions ({ columnTypeId, settings }, { query }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId,
        tableId: settings?.tableId,
        query,
        groupId: this.groupId,
      })
    },
    async updateCRUDAutocompleteSuggestions ({ columnTypeId, settings }, { query }) {
      this.crudAutocompleteItems = await this.searchItems({
        columnTypeId,
        tableId: settings?.tableId,
        query,
        groupId: this.groupId,
      })
    },
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
          $lckGroupId: this.groupId,
        })
        this.cellState.isValid = true
        lckHelpers.convertDateInRecords(res, this.block.definition.columns)
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
    async onUpdateProcessTrigger ({ processId, enabled }) {
      const res = await patchProcess(processId, { enabled })
      const indexProcessRow = this.processesByRow.findIndex(process => process.id === processId)
      if (res && indexProcessRow >= 0) {
        this.processesByRow[indexProcessRow].enabled = res.enabled
      }
    },
    async onTriggerProcess ({ rowId, processId, name }) {
      const res = await createProcessRun({
        table_row_id: rowId,
        process_id: processId,
        waitForOutput: true,
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
    async goToPage () {
      this.$toast.add({
        severity: 'info',
        summary: this.$t('components.datatable.notifWarningRedirectionAction.summary'),
        detail: this.$t('components.datatable.notifWarningRedirectionAction.detail'),
        life: 5000,
      })
    },
    async onMultipleAutocompleteEditNewRow (columnId) {
      this.newRow.data[columnId] = this.multipleAutocompleteInput[columnId].map(item => item.value)
    },
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
          lckHelpers.convertDateInRecords(res, this.block.definition.columns)
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
          lckHelpers.convertDateInRecords(res, this.block.definition.columns)
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
    async onDownloadAttachment ({ url, filename, mime }) {
      lckHelpers.downloadAttachment(url, filename, mime)
    },
    async goToSpecificTable (tableId) {
      // Go to another table page
      await this.$router.replace({
        name: this.DATABASE_ROUTE,
        params: {
          groupId: this.groupId,
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
    // load the table whose the id is in the url (or the first one if no one is specified)
    if (this.database.tables.length > 0) {
      this.currentTableId = this.tableId || this.database.tables[0].id
      this.goToSpecificTable(this.currentTableId)
      this.loadTableAndProcess()
    }
  },
  async beforeRouteUpdate (to, from, next) {
    // Load the data related to the table whose the id is specified in the url
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
.lck-database-nav {
  border-bottom: 1px solid var(--header-border-bottom-color);
}

.lck-database-nav a {
  background-color: transparent;
  border: 1px solid var(--surface-a);
  border-bottom: 0px;
  border-radius: 3px 3px 0 0;
  color: var(--surface-a);
  margin: 0 0.25rem;
  padding: 0.25em 0.5em;
  text-decoration: none;
  white-space: nowrap;
}

.lck-database-nav .router-link-active {
  pointer-events: none;
  color: var(--paginator-text-color-active);
  background-color: var(--surface-a);
  border-color: var(--primary-color-darken);
}

.lck-database-nav a:hover {
  color: var(--primary-color-darken);
  border-color: var(--primary-color-darken);
}

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
  border-bottom: 1px solid var(--toolbar-border-bottom-color);
  background-color: var(--toolbar-background-color);
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
