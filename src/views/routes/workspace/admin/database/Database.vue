<template>
  <div class="p-d-flex p-flex-column d-flex-1 o-auto">
    <div
      v-if="databaseState.data.tables.length > 0"
      class="p-d-flex p-flex-column d-flex-1 o-auto"
    >
      <div class="p-d-flex p-jc-between o-auto lck-database-nav">
        <p-tab-view
          class="p-d-flex p-flex-column p-mt-2 o-auto"
          @tab-change="handleTabChange"
        >
          <p-tab-panel
            v-for="table in databaseState.data.tables"
            :key="table.id"
            :data-table-id="table.id"
            :header="table.text"
          />
        </p-tab-view>

        <div class="p-d-flex p-as-end">
          <p-button
            :label="$t('pages.process.titleButton')"
            class="p-button-sm p-button-info p-m-1 p-p-1"
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
          style="position: relative;"
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
                :columns="displayColumnsView.columns"
                :dropdownOptionsColumns="columnsEnhanced"
                v-model="currentDatatableFilters"
                :disabled="currentView && currentView.locked"
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
              <p-button
                label="Export"
                class="p-button-secondary"
                :icon="exporting ? 'pi pi-spin pi-spinner' : 'pi pi-download'"
                :disabled="!selectedViewId"
                @click="onClickExportButton"
              />
            </div>
          </template>

          <lck-datatable
            v-if="block.definition"
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

            @update-content="onUpdateContent"
            @update-suggestions="updateCRUDAutocompleteSuggestions"
            @update-cell="onUpdateCell"
            @sort="onSort"
            @column-resize="onColumnResize"
            @column-reorder="onColumnReorder"
            @row-delete="onRowDelete"
            @row-duplicate="onRowDuplicate"
            @open-detail="onOpenDetail"
            @create-process-run="onTriggerProcess"
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
      <p-dialog
        :visible.sync="displayNewDialog"
        :style="{width: '600px'}"
        :header="$t('pages.database.addNewRow')"
        :modal="true"
        :contentStyle="{ 'max-height': '70vh'}"
        :closeOnEscape="true"
        class="p-fluid"
      >
        <div v-if="block.definition" style="padding-bottom: 10rem">
          <div
            class="p-field"
            v-for="column in editableColumns"
            :key="column.id"
          >
            <label :for="column.id">{{ column.text }}</label>

            <lck-autocomplete
              v-if="getComponentEditableColumn(column.column_type_id) === 'lck-autocomplete'"
              :id="column.id"
              :dropdown="true"
              :placeholder="$t('components.datatable.placeholder')"
              field="label"
              :suggestions="autocompleteSuggestions"
              @search="updateLocalAutocompleteSuggestions(column, $event)"
              v-model="autocompleteInput[column.id]"
              @item-select="newRow.data[column.id] = $event.value.value"
            />
            <p-dropdown
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-dropdown'"
              :id="column.id"
              :options="columnsEnhanced[column.id].dropdownOptions"
              optionLabel="label"
              optionValue="value"
              :showClear="true"
              :placeholder="$t('components.datatable.placeholder')"
              v-model="newRow.data[column.id]"
            />
            <lck-multiselect
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'lck-multiselect'"
              :id="column.id"
              :options="columnsEnhanced[column.id].dropdownOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('components.datatable.placeholder')"
              v-model="newRow.data[column.id]"
            />
            <p-calendar
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-calendar'"
              :id="column.id"
              :dateFormat="$t('date.dateFormatPrime')"
              v-model="newRow.data[column.id]"
              appendTo="body"
            />
            <p-input-number
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-input-float'"
              v-model="newRow.data[column.id]"
              mode="decimal"
              :minFractionDigits="2"
            />
            <component
              v-else
              :is="getComponentEditableColumn(column.column_type_id)"
              :id="column.id"
              v-model="newRow.data[column.id]"
            />
          </div>
        </div>

        <template #footer>
          <p-button
            :label="$t('form.cancel')"
            icon="pi pi-times"
            class="p-button-text"
            @click="displayNewDialog = false"
          />
          <p-button
            disabled
            v-if="submitting"
            :label="$t('form.waiting')"
            icon="pi pi-spin pi-spinner"
            class="p-button-text"
          />
          <p-button
            v-else
            :label="$t('form.submit')"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveRow"
          />
        </template>
      </p-dialog>

      <p-dialog
        :visible.sync="displayRowDialog"
        :style="{width: '800px'}"
        :modal="true"
        :contentStyle="{ 'max-height': '70vh'}"
        :closeOnEscape="true"
        class="p-fluid"
      >
        <template #header>
          <h2>{{ $t('components.datatable.detail') }}</h2>
        </template>

        <div
          class="p-fluid"
        >
          <div>
            <lck-data-detail
              :crudMode="crudMode"
              :definition="block.definition"
              :row="row"
              :autocompleteSuggestions="autocompleteSuggestions"
              @update-suggestions="updateLocalAutocompleteSuggestions"
              @update-row="onUpdateCell"
            />
            <lck-process-panel
              :processesByRow="processesByRow"
              :rowId="row.id"
              @create-process-run="onTriggerProcess"
              @toggle-process="onUpdateProcessTrigger"
            />
          </div>
        </div>
      </p-dialog>
    </div>
    <div v-else>
      {{ $t('pages.database.noDatabase') }}
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import Vue from 'vue'
import saveAs from 'file-saver'

import { formatISO } from 'date-fns'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  databaseState,
  patchTableData,
  retrieveDatabaseTableAndViewsDefinitions,
  retrieveTableColumns,
  retrieveTableRowsWithSkipAndLimit,
  retrieveTableViews,
  saveTableData
} from '@/store/database'
import {
  createProcessRun,
  patchProcess,
  retrieveManualProcessWithRuns,
  retrieveProcessesByRow
} from '@/store/process'
import { getComponentEditableColumn, isEditableColumn } from '@/services/lck-utils/columns'
import { lckHelpers, lckServices } from '@/services/lck-api'

import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'

import DataTable from '@/components/store/DataTable/DataTable.vue'
import ProcessPanel from '@/components/store/ProcessPanel/ProcessPanel'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import ViewButton from '@/components/store/ViewButton/ViewButton.vue'
import ViewDialog from '@/components/store/ViewButton/ViewDialog.vue'
import ViewColumnButton from '@/components/store/ViewColumnButton/ViewColumnButton.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

import WithToolbar from '@/layouts/WithToolbar'

import ProcessListing from '@/views/routes/workspace/admin/process/ProcessListing'

const defaultDatatableSort = {
  createdAt: 1
}

export default {
  name: 'Database',
  components: {
    'lck-datatable': DataTable,
    'lck-autocomplete': AutoComplete,
    'lck-filter-button': FilterButton,
    'lck-view-button': ViewButton,
    'lck-view-dialog': ViewDialog,
    'lck-view-column-button': ViewColumnButton,
    'lck-multiselect': MultiSelect,
    'lck-data-detail': DataDetail,
    'lck-process-panel': ProcessPanel,
    'layout-with-toolbar': WithToolbar,
    'lck-process-listing': ProcessListing,
    'p-dialog': Vue.extend(Dialog),
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-calendar': Vue.extend(Calendar),
    'p-toolbar': Vue.extend(Toolbar),
    'p-button': Vue.extend(Button)
  },
  props: {
    databaseId: {
      type: String,
      required: true
    },
    workspaceId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // eslint-disable-next-line no-undef
      PAGE_DATABASE_BACKGROUND_IMAGE_URL: LCK_SETTINGS.PAGE_DATABASE_BACKGROUND_IMAGE_URL,
      databaseState,
      crudMode: true,
      cellState: {},
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
        data: {
        }
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
      crudAutocompleteItems: null,
      /**
       * View part, display the dialog and edit data
       */
      displayViewDialog: false,
      viewDialogData: {},
      displayRowDialog: false,
      row: {},
      displayPanel: false
    }
  },
  computed: {
    currentBlockDropdownOptions () {
      const result = {}
      this.block.definition.columns.forEach(currentColumn => {
        if (
          currentColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
          currentColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
        ) {
          result[currentColumn.id] = Object.keys(currentColumn.settings.values).map(k => ({
            value: k,
            label: currentColumn.settings.values[k].label
          }))
        }
      })
      return result
    },
    editableColumns () {
      if (!this.block.definition.columns) return []
      return this.block.definition.columns.filter(c => this.isEditableColumn(this.crudMode, c))
    },
    columnsEnhanced () {
      if (!this.block.definition.columns) return {}
      const result = {}
      this.block.definition.columns.forEach(currentColumn => {
        result[currentColumn.id] = {
          // eslint-disable-next-line @typescript-eslint/camelcase
          column_type_id: currentColumn.column_type_id
        }
        if (
          currentColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
          currentColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
        ) {
          result[currentColumn.id].dropdownOptions = Object.keys(currentColumn.settings.values).map(k => ({
            value: k,
            label: currentColumn.settings.values[k].label
          }))
        }
      })
      return result
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
    }
  },
  methods: {
    getComponentEditableColumn,
    isEditableColumn,
    searchItems: lckHelpers.searchItems,
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
        data: {
        }
      }
      this.submitting = false
      this.currentDatatableFirst = 0
      this.currentDatatableRows = 20
      this.currentPageIndex = 0
      this.currentDatatableSort = {
        ...defaultDatatableSort
      }
      this.currentDatatableFilters = []
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
    getCurrentFilters () {
      return this.currentDatatableFilters
        .filter(filter => ![filter.column, filter.action, filter.pattern].includes(null))
        .map((filter, index) => ({
          req:
            // Operator
            `${filter.operator}[${index}]` +
            // Field
            (column_type => {
              switch (column_type) {
                case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                case COLUMN_TYPE.LOOKED_UP_COLUMN:
                  return `[data][${filter.column.value}.value]`
                default:
                  return `[data][${filter.column.value}]`
              }
            })(filter.column.type) +
            // Action
            `[${filter.action.value}]`,
          value: (column_type => {
            switch (column_type) {
              case COLUMN_TYPE.DATE:
                if (filter.pattern instanceof Date) {
                  try {
                    return formatISO(filter.pattern, { representation: 'date' })
                  } catch (RangeError) {}
                }
            }
            return ['$ilike', '$notILike'].includes(filter.action.value) ? `%${filter.pattern}%` : filter.pattern
          })(filter.column.type)
        }))
    },
    async loadCurrentTableData () {
      this.block.loading = true
      this.block.content = await retrieveTableRowsWithSkipAndLimit(
        this.currentTableId,
        {
          skip: this.currentPageIndex * this.currentDatatableRows,
          limit: this.currentDatatableRows,
          sort: this.currentDatatableSort,
          filters: this.getCurrentFilters()
        }
      )
      this.block.loading = false
    },
    async saveRow () {
      this.submitting = true
      const dataToSubmit = {
        data: {
          ...this.newRow.data
        }
      }
      /**
       * For date columns, we format the date to ISO, date only
       */
      this.block.definition.columns
        .filter(c => c.column_type_id === COLUMN_TYPE.DATE)
        .forEach(c => {
          if (this.newRow.data[c.id] instanceof Date) {
            dataToSubmit.data[c.id] = formatISO(this.newRow.data[c.id], { representation: 'date' })
          } else {
            dataToSubmit.data[c.id] = null
          }
        })
      await saveTableData({
        ...dataToSubmit,
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
      this.displayNewDialog = true
    },
    async onClickExportButton () {
      if (!this.selectedViewId) return
      this.exporting = true
      const data = await lckHelpers.exportTableRowData(
        this.selectedViewId,
        this.getCurrentFilters()
      )
      saveAs(
        new Blob([data]),
        this.currentView.text + '.csv',
        {
          type: 'text/csv;charset=utf-8'
        })
      this.exporting = false
    },
    onClickCreateProcess () {
      console.log('onClickCreateProcess')
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
            position: value.length + index
          })
        ))
      }
      if (columnsIdsToRemove.length > 0) {
        columnsIdsToRemove.forEach(id => updatePromises.push(
          lckServices.tableViewColumn.remove(`${this.selectedViewId},${id}`)
        ))
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
        if (viewToRemove.id === this.selectedViewId) this.selectedViewId = this.views[0].id
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.lck.' + error.data.code),
          life: 3000
        })
      }
    },
    async onReorderView (views) {
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
      }
      this.displayViewDialog = false
    },
    async onColumnResize (newWidth, columnId) {
      // first, find the column related
      const currentColumn = this.block.definition.columns.find(c => c.id === columnId)
      if (!currentColumn) return
      const newColumn = await lckServices.tableViewColumn.patch(
        `${this.selectedViewId},${columnId}`, {
          display: {
            ...currentColumn.display,
            width: newWidth
          }
        })
      // replace existing definition with new column
      currentColumn.display = newColumn.display
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
    async onRowDelete (row) {
      await lckServices.tableRow.remove(row.id)
      this.loadCurrentTableData()
    },
    async onRowDuplicate ({ data, table_id }) {
      const duplicatedData = {}
      this.block.definition.columns.forEach(c => {
        if (c.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN) {
          duplicatedData[c.id] = (data[c.id]?.reference ? data[c.id].reference : data[c.id])
        }
      })
      await lckServices.tableRow.create({ data: duplicatedData, table_id })
      this.loadCurrentTableData()
    },
    async onOpenDetail (rowId) {
      this.displayRowDialog = true
      this.row = await this.block.content.data.find(({ id }) => id === rowId)
      this.processesByRow = await retrieveProcessesByRow(this.currentTableId, rowId)
    },
    async updateLocalAutocompleteSuggestions ({ column_type_id, settings }, { query }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId: column_type_id,
        tableId: settings?.tableId,
        query
      })
    },
    async updateCRUDAutocompleteSuggestions ({ column_type_id, settings }, { query }) {
      this.crudAutocompleteItems = await this.searchItems({
        columnTypeId: column_type_id,
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
        const res = await patchTableData(currentRow.id, {
          data: {
            [columnId]: newValue
          }
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
        process_id: processId
      })
      if (res && res.error) {
        this.$toast.add({
          severity: 'error',
          summary: name,
          detail: this.$t('error.http.' + res.code),
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
    }
  },
  async mounted () {
    await retrieveDatabaseTableAndViewsDefinitions(this.databaseId)

    // load the first table
    if (this.databaseState.data.tables.length > 0) {
      this.currentTableId = this.databaseState.data.tables[0].id
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
  background-color: var(--text-color);
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
  color: var(--text-color);
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
  border-bottom: 1px solid var(--header-border-bottom-color);
  background-color: var(--header-background-color);
}

.lck-database-panel {
  background-color: white;
  width: 30rem;
  border-left: 1px solid var(--header-border-bottom-color);
}
</style>
