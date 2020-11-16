<template>
  <div class="p-d-flex p-flex-column d-flex-1 o-auto">
    <div
      class="lck-database-background"
      :style="`background-image: url(${PAGE_DATABASE_BACKGROUND_IMAGE_URL})`"
    />
    <!--
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ $t('pages.database.title')}}
      <strong>{{ databaseState.data.text }}</strong>
    </header>
    -->
    <div
      v-if="databaseState.data.tables.length > 0"
      class="p-d-flex p-flex-column d-flex-1 o-auto"
    >
      <p-tab-view
        class="p-d-flex p-flex-column p-mt-2"
        @tab-change="handleTabChange"
      >
        <p-tab-panel
          v-for="table in databaseState.data.tables"
          :key="table.id"
          :data-table-id="table.id"
          :header="table.text"
        />
      </p-tab-view>

      <div
        class="p-p-1 p-d-flex p-jc-between p-flex-wrap lck-database-toolbar"
      >
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
            class="p-mr-2"
            @click="onClickAddButton"
          />
          <p-button
            label="Export"
            class="p-button-secondary"
            :icon="exporting ? 'pi pi-spin pi-spinner' : 'pi pi-download'"
            :disabled="!this.selectedViewId"
            @click="onClickExportButton"
          />
        </div>
      </div>

      <lck-datatable
        v-if="block.definition"
        :definition="displayColumnsView"
        :content="block.content"
        :loading="block.loading"
        :autocompleteSuggestions="crudAutocompleteItems"
        :rowsNumber="currentDatatableRows"
        :crud-mode="true"
        :locked="currentView && currentView.locked"
        @update-content="onUpdateContent"
        @update-suggestions="updateCRUDAutocompleteSuggestions"
        @update-cell="onUpdateCell"
        @sort="onSort"
        @column-resize="onColumnResize"
        @column-reorder="onColumnReorder"
        @row-delete="onRowDelete"
        @row-duplicate="onRowDuplicate"
        @row-content="onRowDialog"
      />

      <p-dialog
        :visible.sync="displayNewDialog"
        :style="{width: '450px'}"
        :header="$t('pages.database.addNewRow')"
        :modal="true"
        :contentStyle="{ 'max-height': '60vh'}"
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
              :suggestions="autocompleteItems"
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
        :style="{width: '450px'}"
        header="Test"
        :modal="true"
        :contentStyle="{ 'max-height': '60vh'}"
        :closeOnEscape="true"
        class="p-fluid"
      >
        <lck-dataDetail
          :crudMode="true"
          :definition="displayColumnsView"
          :row="row"
          :autocompleteItems="autocompleteItems"
          @update-suggestions="updateLocalAutocompleteSuggestions"
          @update-cell="onUpdateCell"
        />
        <p-toolbar>
          <template slot="left">
            <p-button label="Action 1" />
            <p-button label="Action 2" />
          </template>
        </p-toolbar>
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
  retrieveDatabaseTableAndViewsDefinitions,
  retrieveTableColumns,
  retrieveTableViews,
  databaseState,
  saveTableData,
  patchTableData,
  retrieveTableRowsWithSkipAndLimit
} from '@/store/database'
import { getComponentEditableColumn, isEditableColumn } from '@/utils/columns'
import { lckHelpers, lckServices } from '@/services/lck-api'

import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Dropdown from 'primevue/dropdown'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'

import DataTable from '@/components/store/DataTable/DataTable.vue'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import ViewButton from '@/components/store/ViewButton/ViewButton.vue'
import ViewDialog from '@/components/store/ViewButton/ViewDialog.vue'
import ViewColumnButton from '@/components/store/ViewColumnButton/ViewColumnButton.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'

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
    'lck-dataDetail': DataDetail,
    'p-dialog': Vue.extend(Dialog),
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-calendar': Vue.extend(Calendar),
    'p-toolbar': Vue.extend(Toolbar),
    'p-button': Vue.extend(Button)
  },
  props: {
    databaseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // eslint-disable-next-line no-undef
      PAGE_DATABASE_BACKGROUND_IMAGE_URL: LCK_SETTINGS.PAGE_DATABASE_BACKGROUND_IMAGE_URL,
      databaseState,
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
      autocompleteItems: null,
      autocompleteInput: {},
      crudAutocompleteItems: null,
      /**
       * View part, display the dialog and edit data
       */
      displayViewDialog: false,
      viewDialogData: {},
      displayRowDialog: false,
      row: {}
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
      this.loadTable()
    },
    async loadTable () {
      this.block.loading = true
      this.block.content = {
        total: 0,
        data: null
      }
      this.block.definition.columns = await retrieveTableColumns(this.currentTableId)

      this.views = await retrieveTableViews(this.currentTableId)
      this.views.length > 0 && (this.selectedViewId = this.views[0].id)
      this.block.loading = false
      this.loadCurrentTableData()
    },
    getCurrentFilters () {
      return this.currentDatatableFilters.map((filter, index) => ({
        // Override action $notNull with a valid query
        req: `${filter.operator}[${index}][data][${filter.column.value}][${filter.action.value}]`,
        value: ['$ilike', '$notILike'].includes(filter.action.value) ? `%${filter.pattern}%` : filter.pattern
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
          this.newRow.data[c.id] = c.settings.default
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
      // fromId,
      // toId
    }) {
      // if from & to indexes are equal, nothing to do => exit
      if (fromIndex === toIndex) return
      // first, find the column related
      await lckServices.tableViewColumn.patch(
        `${this.selectedViewId},${this.currentView.columns[fromIndex].id}`, {
          position: toIndex
        })
      if (fromIndex > toIndex) {
        // if the fromIndex is after the toIndex
        // we need to update all columns after the toIndex, included, fromIndex excluded
        for (let i1 = toIndex; i1 < fromIndex; i1++) {
          await lckServices.tableViewColumn.patch(
            `${this.selectedViewId},${this.currentView.columns[i1].id}`, {
              position: i1 + 1
            })
        }
      } else {
        // if not,
        // we need to update all columns between fromIndex and toIndex, fromIndex excluded
        for (let i2 = fromIndex + 1; i2 <= toIndex; i2++) {
          await lckServices.tableViewColumn.patch(
            `${this.selectedViewId},${this.currentView.columns[i2].id}`, {
              position: i2 - 1
            })
        }
      }
      // this.views = await retrieveTableViews(this.currentTableId)
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
    async onRowDialog (rowId) {
      this.displayRowDialog = true
      this.row = await this.block.content.data.find(({ id }) => id === rowId)
      // Object.keys(this.row.data).forEach(key => {
      //   if (typeof this.row.data[key] === 'object' && this.row.data[key] !== null) {
      //     const copy = this.row.data[key]
      //     this.row.data[key] = copy.value
      //   }
      // })
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    async updateLocalAutocompleteSuggestions ({ column_type_id, settings }, { query }) {
      this.autocompleteItems = await this.searchItems({
        // eslint-disable-next-line @typescript-eslint/camelcase
        columnTypeId: column_type_id,
        tableId: settings?.tableId,
        query
      })
    },
    async updateCRUDAutocompleteSuggestions (columnTypeId, tableId, query) {
      this.crudAutocompleteItems = await this.searchItems({
        columnTypeId,
        tableId,
        query
      })
    },
    async searchItems ({ columnTypeId, tableId, query }) {
      let items = null
      if (columnTypeId === COLUMN_TYPE.USER) {
        const result = await lckServices.user.find({
          query: {
            blocked: false,
            name: {
              $ilike: `%${query}%`
            }
          }
        })
        items = result.data.map(d => ({
          label: d.name,
          value: d.id
        }))
      } else if (columnTypeId === COLUMN_TYPE.GROUP) {
        const result = await lckServices.group.find({
          query: {
            name: {
              $ilike: `%${query}%`
            }
          }
        })
        items = result.data.map(d => ({
          label: d.name,
          value: d.id
        }))
      // eslint-disable-next-line @typescript-eslint/camelcase
      } else if (columnTypeId === COLUMN_TYPE.RELATION_BETWEEN_TABLES) {
        const result = await lckServices.tableRow.find({
          query: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            table_id: tableId,
            text: {
              $ilike: `%${query}%`
            }
          }
        })
        items = result.data.map(d => ({
          label: d.text,
          value: d.id
        }))
      }
      return items
    },
    async onUpdateCell ({ rowId, columnId, newValue }) {
      const currentRow = this.block.content.data.find(({ id }) => id === rowId)

      const data = {
        data: {
          [columnId]: newValue
        }
      }
      const res = await patchTableData(currentRow.id, data)
      currentRow.data = res.data
    }
  },
  async mounted () {
    await retrieveDatabaseTableAndViewsDefinitions(this.databaseId)
    // load the first table
    if (this.databaseState.data.tables.length > 0) {
      this.currentTableId = this.databaseState.data.tables[0].id
      this.loadTable()
    }
  }
}
</script>

<style scoped>
/deep/ .p-tabview .p-tabview-nav {
  background-color: transparent;
  overflow: auto;
  border: unset;
  flex-wrap: unset;
}

/deep/ .p-tabview .p-tabview-panels {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: unset;
}

/deep/ .p-tabview .p-tabview-panels .p-tabview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/deep/ .p-tabview .p-tabview-nav li {
  white-space: nowrap;
}

/deep/ .p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.5rem;
  background-color: var(--text-color);
  border: 1px solid var(--surface-a);
  border-bottom: 0;
  color: var(--surface-a);
  font-weight: normal;
  margin: 0 0.25rem;
}

/deep/ .p-tabview .p-tabview-nav li .p-tabview-nav-link:hover {
  color: var(--primary-color-darken);
  border: 1px solid var(--primary-color-darken);
  border-bottom: 0;
}

/deep/ .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background-color: var(--surface-a);
  border: 1px solid var(--primary-color-darken);
  border-bottom: 0;
  color: var(--text-color);
}

/deep/ .p-tabview {
  border-bottom: 1px solid var(--header-border-bottom-color);
}

.lck-database-toolbar {
  border-bottom: 1px solid var(--header-border-bottom-color);
  background-color: var(--header-background-color);
}

.lck-database-background {
  content: "";
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.1;
  pointer-events: none;
}

</style>
