<template>
  <div class="h-full h-max-full">
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ $t('pages.database.title')}}
      <strong>{{ databaseState.data.text }}</strong>
    </header>
    <p-tab-view
      @tab-change="handleTabChange"
      v-if="databaseState.data.tables.length > 0"
    >
      <p-tab-panel
        v-for="table in databaseState.data.tables"
        :key="table.id"
        :data-table-id="table.id"
        :header="table.text"
      >
        <p-toolbar class="p-p-1">
          <template slot="left">
            <p-dropdown
              v-model="selectedView"
              :options="viewsToDisplay"
              optionLabel="text"
              optionValue="id"
              dataKey="id"
              placeholder="Select a view"
              style="display: inline-flex"
            />
          </template>

          <template slot="right">
            <p-button
              label="Add"
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
          :block="block"
          :dropdown-options="currentBlockDropdownOptions"
          v-if="block.definition"
          @updateContentBlockTableView="updateContentBlock(table.id, $event)"
          @sort="onSort"
          @column-resize="onColumnResize"
        />
        <p-dialog
          :visible.sync="displayNewDialog"
          :style="{width: '450px'}"
          :header="$t('pages.database.addNewRow')"
          :modal="true"
          class="p-fluid"
        >
          <div
            class="p-field"
          >
            <label for="reference">Référence</label>
            <p-input-text
              id="reference"
              v-model="newRow.text"
            />
          </div>
          <div v-if="block.definition">
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
              <p-autocomplete
                v-if="getComponentEditableColumn(column.column_type_id) === 'p-autocomplete'"
                :id="column.id"
                :dropdown="true"
                :placeholder="$t('components.dropdown.placeholder')"
                field="label"
                v-model="newRow.data[column.id]"
              />
              <p-dropdown
                v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-dropdown'"
                :id="column.id"
                :options="currentBlockDropdownOptions[column.id]"
                optionLabel="label"
                optionValue="value"
                :showClear="true"
                :placeholder="$t('components.dropdown.placeholder')"
                v-model="newRow.data[column.id]"
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
              label="Please wait"
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
      </p-tab-panel>
    </p-tab-view>
    <div v-else>
      {{ $t('pages.database.noDatabase') }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  retrieveDatabaseByWorkspaceId,
  retrieveTableColumns,
  retrieveTableViews,
  databaseState,
  saveTableData,
  retrieveTableRowsWithSkipAndLimit
} from '@/store/database'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Dropdown from 'primevue/dropdown'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import AutoComplete from 'primevue/autocomplete'
import InputNumber from 'primevue/inputnumber'

import CrudTable from '@/components/store/CrudTable/CrudTable'
import lckClient from '@/services/lck-api'

const defaultDatatableSort = {
  createdAt: 1
}

export default {
  name: 'Database',
  components: {
    CrudTable,
    'p-dialog': Vue.extend(Dialog),
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
    'p-autocomplete': Vue.extend(AutoComplete),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
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
        content: null
      },
      views: [],
      selectedView: 'complete',
      displayNewDialog: false,
      newRow: {
        data: {
        },
        text: ''
      },
      submitting: false,
      currentTableId: null,
      currentDatatableFirst: 0,
      currentDatatableRows: 20,
      currentDatatableSort: {
        ...defaultDatatableSort
      }
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
    }
  },
  methods: {
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
        },
        text: ''
      }
      this.submitting = false
      this.currentDatatableFirst = 0
      this.currentDatatableRows = 20
      this.currentDatatableSort = {
        ...defaultDatatableSort
      }
    },
    getComponentEditableColumn (columnTypeId) {
      switch (columnTypeId) {
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
          return 'p-autocomplete'
        case COLUMN_TYPE.BOOLEAN:
          return 'p-input-switch'
        case COLUMN_TYPE.NUMBER:
        case COLUMN_TYPE.FLOAT:
          return 'p-input-number'
        case COLUMN_TYPE.MULTI_SELECT:
        case COLUMN_TYPE.SINGLE_SELECT:
          return 'p-dropdown'
        case COLUMN_TYPE.DATE:
          return 'p-calendar'
        default:
          return 'p-input-text'
      }
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
    async updateContentBlock (tableId, { first, rows }) {
      this.currentDatatableFirst = first
      this.currentDatatableRows = rows
      this.loadCurrentTableData()
    },
    handleTabChange (event) {
      this.resetToDefault()
      this.currentTableId = event.tab.$el.dataset?.tableId
      this.loadTable()
    },
    async loadTable () {
      this.block.loading = true
      const promises = await Promise.all([
        retrieveTableColumns(this.currentTableId),
        retrieveTableViews(this.currentTableId),
        this.loadCurrentTableData(this.currentDatatableRows * 2)
      ])
      this.views = promises[1]
      this.block = {
        ...this.block,
        definition: {
          columns: promises[0]
        }
      }
      this.block.loading = false
    },
    async loadCurrentTableData (overwriteDatatableRows) {
      this.block.loading = true
      this.block.content = await retrieveTableRowsWithSkipAndLimit(
        this.currentTableId,
        this.currentDatatableFirst,
        overwriteDatatableRows || this.currentDatatableRows,
        this.currentDatatableSort
      )
      this.block.loading = false
    },
    async saveRow () {
      this.submitting = true
      await saveTableData({
        ...this.newRow,
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: this.currentTableId
      })
      this.submitting = false
      this.displayNewDialog = false
      this.loadCurrentTableData()
    },
    onSort ({ field, order }) {
      this.currentDatatableSort = {}
      if (field === 'text') {
        this.currentDatatableSort.text = order
      } else {
        this.currentDatatableSort[`ref(data:${field})`] = order
      }
      this.loadCurrentTableData()
    },
    onClickAddButton () {
      this.newRow = {
        text: '',
        data: {}
      }
      this.displayNewDialog = true
    },
    async onColumnResize (newWidth, columnId) {
      console.log(newWidth, columnId)
      // first, find the column related
      const currentColumn = this.block.definition.columns.find(c => c.id === columnId)
      if (!currentColumn) return
      await lckClient.service('column').patch(columnId, {
        settings: {
          ...currentColumn.settings,
          width: newWidth
        }
      })
    }

  },
  async mounted () {
    await retrieveDatabaseByWorkspaceId(this.databaseId)
    // load the first table
    if (this.databaseState.data.tables.length > 0) {
      this.currentTableId = this.databaseState.data.tables[0].id
      this.loadTable()
    }
  }
}
</script>

<style scoped>
/deep/ .p-tabview .p-tabview-panels {
  padding: 0;
}
/deep/ .p-tabview .p-tabview-nav {
  background-color: transparent;
  overflow: auto;
  border: unset;
}
/deep/ .p-tabview-nav {
  flex-wrap: unset;
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
