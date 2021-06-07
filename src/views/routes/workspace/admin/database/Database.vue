<template>
  <div class="p-d-flex p-flex-column d-flex-1 o-auto">
    <div
      v-if="database.tables.length > 0"
      class="p-d-flex p-flex-column d-flex-1 o-auto"
    >
      <div class="p-d-flex p-jc-between o-auto lck-database-nav">
        <p-tab-view
          class="p-d-flex p-flex-column p-mt-2 o-auto"
          @tab-change="handleTabChange"
        >
          <p-tab-panel
            v-for="table in database.tables"
            :key="table.id"
            :data-table-id="table.id"
            :header="table.text"
          />
        </p-tab-view>

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
                @input="resetColumnEdit"
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
                v-model="currentDatatableFilters"
                :disabled="!hasDataToDisplay && currentDatatableFilters.length === 0"
                @submit="onSubmitFilter"
                @reset="onResetFilter"
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
        :header="$t('pages.database.addNewRow')"
        @close="displayNewDialog = false"
        :submitting="submitting"
        @input="saveRow"
      >
        <lck-data-detail
          :crudMode="crudMode"
          :definition="filteredDefinitionColumns"
          :row="newRow"
          :workspaceId="workspaceId"
          :autocompleteSuggestions="autocompleteSuggestions"
          @update-suggestions="updateLocalAutocompleteSuggestions"
          @update-row="onUpdateRow"
          @download-attachment="onDownloadAttachment"
          @upload-files="onUploadFiles($event, newRow)"
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
          @update-suggestions="updateLocalAutocompleteSuggestions"
          @update-row="onUpdateCell"
          @download-attachment="onDownloadAttachment"
          @upload-files="onUploadFiles"
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
          @action-column-edit="onActionColumnEdit"
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

import {
  formatISO,
  isValid,
  parseISO
} from 'date-fns'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  retrieveDatabaseTableAndViewsDefinitions,
  retrieveTableColumns,
  retrieveTableRowsWithSkipAndLimit,
  retrieveTableViews
} from '@/services/lck-helpers/database'
import {
  createProcessRun,
  patchProcess,
  retrieveManualProcessWithRuns,
  retrieveProcessesByRow
} from '@/services/lck-helpers/process'
import {
  isEditableColumn,
  getOriginalColumn
} from '@/services/lck-utils/columns'
import {
  lckHelpers,
  lckServices
} from '@/services/lck-api'

import { getCurrentFilters } from '@/services/lck-utils/filter'
import { PROCESS_RUN_STATUS } from '@/services/lck-api/definitions'

import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
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
  createdAt: 1
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
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
    'p-button': Vue.extend(Button),
    'p-sidebar': Vue.extend(Sidebar)
  },
  props: {
    databaseId: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // eslint-disable-next-line no-undef
      PAGE_DATABASE_BACKGROUND_IMAGE_URL: LCK_THEME.PAGE_DATABASE_BACKGROUND_IMAGE_URL,
      database: null,
      crudMode: true,
      cellState: {},
      fileExportFormat: [
        {
          label: this.$t('components.datatable.toolbar.export.exportCSV'),
          icon: 'pi pi-file',
          command: () => {
            this.onClickExportButtonCSV()
          }
        },
        {
          label: this.$t('components.datatable.toolbar.export.exportXLS'),
          icon: 'pi pi-file-excel',
          command: () => {
            this.onClickExportButtonXLS()
          }
        }
      ],
      block: {
        loading: false,
        content: {
          total: 0,
          data: null
        },
        definition: {
          columns: []
        }
      },
      views: [],
      selectedViewId: null,
      displayNewDialog: false,
      newRow: {
        data: {}
      },
      manualProcesses: [],
      processesByRow: [],
      submitting: false,
      exporting: false,
      currentTableId: null,
      currentDatatableFirst: 0,
      currentDatatableRows: 20,
      currentDatatableSort: {
        ...defaultDatatableSort
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
      // Column part
      currentColumnToEdit: null,
      currentActionColumnToEdit: null,
      showEditColumnSidebar: false
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
          column.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN && column.column_type_id !== COLUMN_TYPE.FORMULA)
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
            label: originalColumn.settings.values[k].label
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
    }
  },
  methods: {
    isEditableColumn,
    getCurrentFilters,
    searchItems: lckHelpers.searchItems,
    async onUpdateRow ({ columnId, newValue }) {
      this.$set(this.newRow.data, columnId, newValue)
    },
    resetToDefault () {
      this.block = {
        loading: false,
        content: null,
        definition: {
          columns: []
        }
      }
      this.views = []
      this.selectedViewId = null
      this.displayNewDialog = false
      this.newRow = {
        data: {}
      }
      this.submitting = false
      this.currentDatatableFirst = 0
      this.currentDatatableRows = 20
      this.currentPageIndex = 0
      this.currentDatatableSort = {
        ...defaultDatatableSort
      }
      this.currentDatatableFilters = []
      this.resetColumnEdit()
    },
    onUpdateContent (pageIndexToGo) {
      this.currentPageIndex = pageIndexToGo
      this.loadCurrentTableData()
    },
    handleTabChange (event) {
      this.resetToDefault()
      this.currentTableId = event.tab.$el.dataset?.tableId
      this.loadTableAndProcess()
    },
    async loadTableAndProcess () {
      this.block.loading = true
      this.block.content = {
        total: 0,
        data: null
      }
      this.block.definition.columns = await retrieveTableColumns(this.currentTableId)
      this.views = await retrieveTableViews(this.currentTableId)
      this.views.length > 0 && (this.selectedViewId = this.views[0].id)
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
          filters: this.getCurrentFilters(this.currentDatatableFilters)
        }
      )
      this.block.loading = false
    },
    async saveRow () {
      this.submitting = true
      const data = { ...this.newRow.data }
      /**
       * For date columns, we format the date to ISO, date only
       */
      this.block.definition.columns
        .filter(c => c.column_type_id === COLUMN_TYPE.DATE)
        .forEach(c => {
          if (isValid(parseISO(this.newRow.data[c.id]))) {
            data[c.id] = formatISO(new Date(this.newRow.data[c.id]), { representation: 'date' })
          } else {
            data[c.id] = null
          }
        })
      /**
       * For file columns, we keep only the attachments ids
       */
      this.block.definition.columns
        .filter(c => c.column_type_id === COLUMN_TYPE.FILE)
        .forEach(c => {
          if (!this.newRow.data[c.id]) return
          data[c.id] = this.newRow.data[c.id].map(a => a.id)
        })
      await lckServices.tableRow.create({
        data,
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: this.currentTableId
      })
      this.submitting = false
      this.displayNewDialog = false
      this.loadCurrentTableData()
    },
    onSort ({ field, order }) {
      this.currentDatatableSort = {
        [`ref(data:${field})`]: order
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
    onClickAddButton () {
      this.newRow = {
        data: {}
      }
      this.block.definition.columns.forEach(c => {
        if (
          c.column_type_id === COLUMN_TYPE.SINGLE_SELECT &&
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
        this.fileName = this.currentView.text
      )
      this.exporting = false
    },
    async onClickExportButtonXLS () {
      if (!this.selectedViewId) return
      this.exporting = true
      await lckHelpers.exportTableRowDataXLS(
        this.selectedViewId,
        this.getCurrentFilters(this.currentDatatableFilters),
        this.fileName = this.currentView.text
      )
      this.exporting = false
    },
    /**
     * When the user update the column's listing of the current view,
     * we update accordingly the view on the backend side (add/remove column in the view)
     */
    async onChangeViewColumns ({ value }) {
      // if (this.selectedViewId === 'complete') return
      /**
       * Compute the diff between the new value and the existing columns
       * if we aren't on the complete selectedView
       */
      const columnsIdsToAdd = value.filter(v => this.viewColumnsIds.indexOf(v) === -1)
      const columnsIdsToRemove = this.viewColumnsIds.filter(v => value.indexOf(v) === -1)
      const updatePromises = []
      if (columnsIdsToAdd.length > 0) {
        columnsIdsToAdd.forEach((id, index) => updatePromises.push(
          lckServices.tableViewColumn.create({
            table_column_id: id,
            table_view_id: this.selectedViewId,
            position: value.length + index,
            displayed: true
          })
        ))
      }
      if (columnsIdsToRemove.length > 0) {
        columnsIdsToRemove.forEach(id => {
          updatePromises.push(
            lckServices.tableViewColumn.remove(`${this.selectedViewId},${id}`)
          )
          if (this.currentColumnToEdit.id === id) this.resetColumnEdit()
        })
      }
      await Promise.all(updatePromises)
      /**
       * Update the view definition
       */
      const newViewDefinition = await lckServices.tableView.get(this.selectedViewId, {
        query: {
          $eager: 'columns'
        }
      })
      this.$set(
        this.views,
        this.views.findIndex(({ id }) => this.selectedViewId === id),
        newViewDefinition
      )
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
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.lck.' + error.data.code),
          life: 3000
        })
      }
    },
    async onReorderView ({ value: views }) {
      this.views = views
      await Promise.all(
        views.map((v, index) => lckServices.tableView.patch(v.id, {
          position: index
        }))
      )
      this.views = await retrieveTableViews(this.currentTableId)
    },
    async saveView (view) {
      if (view.id) {
        await lckServices.tableView.patch(view.id, {
          text: view.text,
          locked: view.locked
        })
        this.views = await retrieveTableViews(this.currentTableId)
      } else {
        const newView = await lckServices.tableView.create({
          table_id: this.currentTableId,
          ...view
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
            width: newWidth
          }
        })
      // replace existing definition with new column
      currentColumn.style = newColumn.style
    },
    async onColumnReorder ({
      fromIndex,
      toIndex
    }) {
      // if from & to indexes are equal, nothing to do => exit
      if (fromIndex === toIndex) return
      // first, find the column related
      await lckServices.tableViewColumn.patch(
        `${this.selectedViewId},${this.viewColumnsIds[fromIndex]}`, {
          position: toIndex
        })
      if (fromIndex > toIndex) {
        // if the fromIndex is after the toIndex
        // we need to update all columns after the toIndex, included, fromIndex excluded
        for (let i1 = toIndex; i1 < fromIndex; i1++) {
          await lckServices.tableViewColumn.patch(
            `${this.selectedViewId},${this.viewColumnsIds[i1]}`, {
              position: i1 + 1
            })
        }
      } else {
        // if not,
        // we need to update all columns between fromIndex and toIndex, fromIndex excluded
        for (let i2 = fromIndex + 1; i2 <= toIndex; i2++) {
          await lckServices.tableViewColumn.patch(
            `${this.selectedViewId},${this.viewColumnsIds[i2]}`, {
              position: i2 - 1
            })
        }
      }
      this.views = await retrieveTableViews(this.currentTableId)
    },
    async onColumnEdit (editedColumnData) {
      this.submitting = true
      if (this.currentColumnToEdit.id) {
        try {
          // API request
          const updatedColumn = await lckServices.tableColumn.patch(
            this.currentColumnToEdit.id,
            editedColumnData
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
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: this.currentColumnToEdit.text,
            detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
            life: 3000
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
            data
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
            life: 3000
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
      if (this.currentColumnToEdit.id) {
        try {
          // Update table view column
          const updatedColumn = await lckServices.tableViewColumn.patch(
            `${this.selectedViewId},${this.currentColumnToEdit.id}`,
            editedColumn
          )
          for (const key in updatedColumn) {
            if (this.currentColumnToEdit[key] == null && updatedColumn[key] != null) this.$set(this.currentColumnToEdit, key, updatedColumn[key])
            else this.currentColumnToEdit[key] = updatedColumn[key]
          }
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: this.currentColumnToEdit.text,
            detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
            life: 3000
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
          life: 3000
        })
      }
    },
    async onRowDuplicate ({ data }) {
      const duplicatedData = {}
      this.block.definition.columns.forEach(c => {
        if (c.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN && c.column_type_id !== COLUMN_TYPE.FORMULA) {
          duplicatedData[c.id] = (data[c.id]?.reference ? data[c.id].reference : data[c.id])
        }
      })
      await lckServices.tableRow.create({ data: duplicatedData, table_id: this.currentTableId })
      this.loadCurrentTableData()
    },
    async onOpenDetail (rowId) {
      this.displayRowDialog = true
      this.row = await this.block.content.data.find(({ id }) => id === rowId)
      this.processesByRow = await retrieveProcessesByRow(this.currentTableId, rowId)
    },
    async updateLocalAutocompleteSuggestions ({ columnTypeId, settings }, { query }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId,
        tableId: settings?.tableId,
        query
      })
    },
    async updateCRUDAutocompleteSuggestions ({ columnTypeId, settings }, { query }) {
      this.crudAutocompleteItems = await this.searchItems({
        columnTypeId,
        tableId: settings?.tableId,
        query
      })
    },
    async onUpdateCell ({ rowId, columnId, newValue }) {
      const currentRow = this.block.content.data.find(({ id }) => id === rowId)
      this.cellState = {
        rowId: currentRow.id,
        columnId,
        waiting: true,
        isValid: false // don't know if we have to set to false or null
      }

      try {
        const res = await lckServices.tableRow.patch(currentRow.id, {
          data: {
            [columnId]: newValue
          },
          $lckGroupId: this.groupId
        })
        this.cellState.isValid = true
        currentRow.data = res.data
      } catch (error) {
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
        waitForOutput: true
      })
      if (res && (res.code || res.status === PROCESS_RUN_STATUS.ERROR)) {
        this.$toast.add({
          severity: 'error',
          summary: name || this.$t('components.processPanel.failedNewRun'),
          detail: res.code ? this.$t('error.http.' + res.code) : this.$t('error.basic'),
          life: 3000
        })
      } else {
        this.$toast.add({
          severity: 'success',
          summary: name,
          detail: this.$t('components.processPanel.successNewRun'),
          life: 3000
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
        summary: this.$t('components.datatable.notifAction.summary'),
        detail: this.$t('components.datatable.notifAction.detail'),
        life: 5000
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
        isValid: false // don't know if we have to set to false or null
      }

      try {
        const newUploadedFiles = await lckHelpers.uploadMultipleFiles(fileList, this.workspaceId)
        /**
         * Here we need to know if we are in a creation or in a row update
         */
        if (newRow) {
          if (!currentRow.data[columnId]) this.$set(currentRow.data, columnId, [])
          currentRow.data[columnId].push(...newUploadedFiles)
        } else {
          const newDataFiles = currentRow.data[columnId]?.map(a => a.id) || []
          newDataFiles.push(...newUploadedFiles.map(u => u.id))

          /**
           * Need to update the data with the new files uploaded + the old files
           */
          const res = await lckServices.tableRow.patch(currentRow.id, {
            data: {
              [columnId]: newDataFiles
            }
          })
          this.cellState.isValid = true
          currentRow.data = res.data
        }
      } catch (error) {
        this.cellState.isValid = false
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: error.message,
          life: 3000
        })
      }
      this.cellState.waiting = false
    },
    async onRemoveAttachment ({ rowId, columnId, attachmentId }) {
      const currentRow = this.block.content.data.find(({ id }) => id === rowId)
      this.cellState = {
        rowId,
        columnId,
        waiting: true,
        isValid: false // don't know if we have to set to false or null
      }

      try {
        const newDataFiles = currentRow.data[columnId]?.filter(a => a.id !== attachmentId).map(a => a.id) || []
        const res = await lckServices.tableRow.patch(currentRow.id, {
          data: {
            [columnId]: newDataFiles
          }
        })
        this.cellState.isValid = true
        currentRow.data = res.data
      } catch (error) {
        this.cellState.isValid = false
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: error.message,
          life: 3000
        })
      }
      this.cellState.waiting = false
    },
    async onDownloadAttachment ({ url, filename, mime }) {
      lckHelpers.downloadAttachment(url, filename, mime)
    }
  },
  async mounted () {
    this.database = await retrieveDatabaseTableAndViewsDefinitions(this.databaseId)
    console.log(this.database)

    // load the first table
    if (this.database.tables.length > 0) {
      this.currentTableId = this.database.tables[0].id
      this.loadTableAndProcess()
    }
  }
}
</script>

<style scoped>
/deep/ .lck-database-nav .p-tabview .p-tabview-nav {
  background-color: transparent;
  overflow: auto;
  border: unset;
  flex-wrap: unset;
}

/deep/ .lck-database-nav .p-tabview .p-tabview-panels {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: unset;
}

/deep/ .lck-database-nav .p-tabview .p-tabview-panels .p-tabview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/deep/ .lck-database-nav .p-tabview .p-tabview-nav li {
  white-space: nowrap;
}

/deep/ .lck-database-nav .p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.5rem;
  border: 1px solid var(--surface-a);
  border-bottom: 0;
  color: var(--surface-a);
  font-weight: normal;
  margin: 0 0.25rem;
}

/deep/ .lck-database-nav .p-tabview .p-tabview-nav li .p-tabview-nav-link:hover {
  color: var(--primary-color-darken);
  border: 1px solid var(--primary-color-darken);
  border-bottom: 0;
}

/deep/ .lck-database-nav .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background-color: var(--surface-a);
  border: 1px solid var(--primary-color-darken);
  border-bottom: 0;
  color: var(--paginator-text-color-active);
}

.lck-database-nav {
  border-bottom: 1px solid var(--header-border-bottom-color);
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

/deep/ .lck-database-panel .lck-toolbar {
  background-color: var(--primary-color) !important;
  color: #fff;
}

/deep/ .lck-database-panel .lck-toolbar .p-button-primary {
  background-color: rgba(255, 255, 255, 0.8);
}

/deep/ .lck-database-panel .lck-toolbar .p-button-primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
}
.process-toolbar-button {
  margin-top: 0.3rem;
}

@media only screen and (max-device-width: 480px) {
  /deep/ .p-button .p-button-icon-left {
    margin-right: 0;
  }
  /deep/ .p-button .p-button-icon-right {
    margin-left: 0;
  }
  /deep/ .p-button .p-button-label {
    display: none;
  }
}
</style>
