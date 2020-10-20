<template>
  <div class="p-d-flex p-flex-column d-flex-1">
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ $t('pages.database.title')}}
      <strong>{{ databaseState.data.text }}</strong>
    </header>
    <div
      v-if="databaseState.data.tables.length > 0"
    >
      <p-tab-view
        class="d-flex-1 p-d-flex p-flex-column"
        @tab-change="handleTabChange"
      >
        <p-tab-panel
          v-for="table in databaseState.data.tables"
          :key="table.id"
          :data-table-id="table.id"
          :header="table.text"
        />
      </p-tab-view>

      <p-toolbar class="p-p-1">
        <template slot="left">
          <p-dropdown
            v-model="selectedView"
            :options="viewsToDisplay"
            optionLabel="text"
            optionValue="id"
            dataKey="id"
            placeholder="Select a view"
            class="p-d-inline-flex"
            @change="loadCurrentTableDefinition"
          />
          <lck-filter-button
            :definitionColumn="block.definition.columns"
            v-model="currentDatatableFilters"
            @submit="onSubmitFilter"
            @reset="onResetFilter"
          />
        </template>

        <template slot="right">
          <p-button
            :label="$t('form.add')"
            icon="pi pi-plus"
            class="p-mr-2"
            @click="onClickAddButton"
          />
          <!-- <p-button
            label="Export"
            icon="pi pi-upload"
            @click="exportCSV($event)"
          /> -->
        </template>
      </p-toolbar>

      <CrudTable
        v-if="block.definition"
        :definition="displayColumnsView"
        :content="block.content"
        :loading="block.loading"
        :autocompleteSuggestions="crudAutocompleteItems"
        :rowsNumber="currentDatatableRows"
        :crud-mode="true"
        @update-content="onUpdateContent"
        @update-suggestions="updateCRUDAutocompleteSuggestions"
        @update-cell="onUpdateCell"
        @sort="onSort"
        @column-resize="onColumnResize"
        @column-reorder="onColumnReorder"
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
            <!--

              :value="block.content.data[slotProps.index].data[column.id] && block.content.data[slotProps.index].data[column.id].value"
              @input="autocompleteInput = $event"
              :suggestions="autocompleteItems"
              @complete="searchItems(column, $event)"
              @item-select="onAutocompleteEdit(slotProps.index, column.id, $event)"

            -->
            <lck-autocomplete
              v-if="getComponentEditableColumn(column.column_type_id) === 'lck-autocomplete'"
              :id="column.id"
              :dropdown="true"
              :placeholder="$t('components.crudtable.placeholder')"
              field="label"
              :suggestions="autocompleteItems"
              @complete="updateLocalAutocompleteSuggestions(column, $event)"
              v-model="autocompleteInput[column.id]"
              :modelValue="newRow.data[column.id]"
              @item-select="newRow.data[column.id] = $event.value.value"
            />
            <p-dropdown
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-dropdown'"
              :id="column.id"
              :options="columnsEnhanced[column.id].dropdownOptions"
              optionLabel="label"
              :showClear="true"
              :placeholder="$t('components.crudtable.placeholder')"
              v-model="newRow.data[column.id]"
            />
            <lck-multiselect
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'lck-multiselect'"
              :id="column.id"
              :options="columnsEnhanced[column.id].dropdownOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('components.crudtable.placeholder')"
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
    </div>
    <div v-else>
      {{ $t('pages.database.noDatabase') }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  retrieveDatabaseTableAndViewsDefinitions,
  retrieveTableColumns,
  retrieveTableViews,
  databaseState,
  saveTableData,
  patchTableData,
  retrieveTableRowsWithSkipAndLimit
} from '@/store/database'
import { getComponentEditableColumn } from '@/utils/columns'

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
import { formatISO } from 'date-fns'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import lckClient from '@/services/lck-api'

import CrudTable from '@/components/store/CrudTable/CrudTable.vue'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'

const defaultDatatableSort = {
  createdAt: 1
}

export default {
  name: 'Database',
  components: {
    CrudTable,
    'lck-autocomplete': AutoComplete,
    'lck-filter-button': FilterButton,
    'lck-multiselect': MultiSelect,
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
      selectedView: 'complete',
      displayColumnsView: {
        columns: []
      },
      displayNewDialog: false,
      newRow: {
        data: {
        }
      },
      submitting: false,
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
      crudAutocompleteItems: null
    }
  },
  computed: {
    viewsToDisplay () {
      return [{
        text: 'Complete',
        id: 'complete'
      }].concat(this.views)
    },
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
      return this.block.definition.columns.filter(c => this.isEditableColumn(c))
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
    }
  },
  methods: {
    getComponentEditableColumn,
    resetToDefault () {
      this.block = {
        loading: false,
        content: null
      }
      this.views = []
      this.selectedView = 'complete'
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
    isEditableColumn (column) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.LOOKED_UP_COLUMN:
        case COLUMN_TYPE.FORMULA:
          return false
        default:
          return true
      }
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
      this.block.definition = {
        columns: await retrieveTableColumns(this.currentTableId)
      }
      const col = await retrieveTableColumns(this.currentTableId)
      this.block.definition.columns = col
      this.displayColumnsView.columns = col

      this.views = await retrieveTableViews(this.currentTableId)
      this.block.loading = false
      this.loadCurrentTableData()
    },
    async loadCurrentTableDefinition () {
      this.block.loading = true
      if (this.selectedView !== 'complete') {
        this.displayColumnsView.columns = this.views.find(({ id }) => this.selectedView === id).columns
      } else {
        this.displayColumnsView.columns = this.block.definition.columns
      }
      this.block.loading = false
    },
    async loadCurrentTableData () {
      this.block.loading = true
      const filters = this.currentDatatableFilters.map((filter, index) => ({
        // Override action $notNull with a valid query
        req: `${filter.operator}[${index}][data][${filter.column.value}][${filter.action !== '$notNull' ? filter.action : '$null'}]`,
        value: ['$ilike', '$notILike'].includes(filter.action) ? `%${filter.pattern}%` : filter.pattern
      }))
      this.block.content = await retrieveTableRowsWithSkipAndLimit(
        this.currentTableId,
        {
          skip: this.currentPageIndex * this.currentDatatableRows,
          limit: this.currentDatatableRows,
          sort: this.currentDatatableSort,
          filters
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
      /**
       * For multiselect columns, we return an array of string
       */
      // this.block.definition.columns
      //   .filter(c => c.column_type_id === COLUMN_TYPE.MULTI_SELECT)
      //   .forEach(c => {
      //     dataToSubmit.data[c.id] = this.newRow.data[c.id]?.map(v => v.value)
      //   })
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
    async onColumnResize (newWidth, columnId) {
      // first, find the column related
      const currentColumnIndex = this.block.definition.columns.findIndex(c => c.id === columnId)
      if (currentColumnIndex === -1) return
      const newColumn = await lckClient.service('column').patch(columnId, {
        settings: {
          ...this.block.definition.columns[currentColumnIndex].settings,
          width: newWidth
        }
      })
      // replace existing definition with new column
      this.block.definition.columns = this.block.definition.columns.map(c => {
        return c.id === columnId ? newColumn : c
      })
    },
    async onColumnReorder ({
      fromIndex,
      toIndex
    }) {
      const newDefinitionColumns = [...this.block.definition.columns]
      // if from & to indexes are equal, nothing to do => exit
      if (fromIndex === toIndex) return
      // first, find the column related
      await lckClient.service('column').patch(this.block.definition.columns[fromIndex].id, {
        position: toIndex
      })
      newDefinitionColumns[toIndex] = this.block.definition.columns[fromIndex]
      if (fromIndex > toIndex) {
        // if the fromIndex is after the toIndex
        // we need to update all columns after the toIndex, included, fromIndex excluded
        for (let i1 = toIndex; i1 < fromIndex; i1++) {
          await lckClient.service('column').patch(this.block.definition.columns[i1].id, {
            position: i1 + 1
          })
          newDefinitionColumns[i1 + 1] = this.block.definition.columns[i1]
        }
      } else {
        // if not,
        // we need to update all columns between fromIndex and toIndex, fromIndex excluded
        for (let i2 = fromIndex + 1; i2 <= toIndex; i2++) {
          await lckClient.service('column').patch(this.block.definition.columns[i2].id, {
            position: i2 - 1
          })
          newDefinitionColumns[i2 - 1] = this.block.definition.columns[i2]
        }
      }
      this.block.definition.columns = newDefinitionColumns
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
        const result = await lckClient.service('user').find({
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
        const result = await lckClient.service('group').find({
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
        const result = await lckClient.service('row').find({
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
    async onUpdateCell ({ rowIndex, columnId, newValue }) {
      const currentRow = this.block.content.data[rowIndex]

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
  color: var(--surface-a);
  font-weight: normal;
  margin-right: 0.5rem;
}

/deep/ .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background-color: var(--surface-a);
  border: 1px solid var(--text-color);
  color: var(--text-color);
}

</style>
