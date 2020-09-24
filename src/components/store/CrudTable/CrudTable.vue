<template>
  <p-datatable
    v-if="block.content && block.content.data"

    class="p-datatable-sm p-datatable-gridlines"
    :value="block.content.data"

    :lazy="true"
    :loading="block.loading"

    :rows="20"
    :totalRecords="block.content.total"

    editMode="cell"
    @cell-edit-complete="onCellEditComplete"

    :resizableColumns="true"
    columnResizeMode="expand"
    @column-resize-end="onColumnResize"

    :scrollable="true"
    scrollHeight="500px"
    :virtualScroll="true"
    :virtualRowHeight="34"
    @virtual-scroll="onVirtualScroll"

    @sort="onSort"
  >
    <p-column
      field="text"
      sortable
      headerStyle="width: 150px"
    >
      <template #header>
        <span data-column-id="text">Référence</span>
      </template>
      <template #loading>
        <div class="loading-text">Loading</div>
      </template>

      <template
        #body="slotProps"
      >
        {{ slotProps.data.text }}
      </template>
      <template #editor>
        <p-inputtext
          :value="slotProps.data.text"
          @input="onCellEdit($event, slotProps)"
        />
      </template>
    </p-column>
    <p-column
      v-for="column in block.definition.columns"
      :key="column.id"
      :field="column.id"
      :headerStyle="{
        width: ( ( column.settings && column.settings.width ) || '150' ) + 'px'
      }"
      sortable
    >
      <template #header>
        <span :data-column-id="column.id">
          {{ column.text }}
        </span>
      </template>
      <template #loading>
        <div class="loading-text">Loading</div>
      </template>
      <template #editor="slotProps">
        <span v-if="!isEditableColumn(column)">
          {{ getValue(column, slotProps.data.data[column.id]) }}
        </span>
          <!-- :value="slotProps.data.data[column.id] && slotProps.data.data[column.id].value" -->
        <p-autocomplete
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-autocomplete'"
          :dropdown="true"
          :placeholder="$t('components.dropdown.placeholder')"
          field="label"
          v-model="autocompleteInput"
          @focus="autocompleteInput = slotProps.data.data[column.id] && slotProps.data.data[column.id].value"
          :suggestions="autocompleteItems"
          @complete="searchItems(column, $event)"
          @item-select="onAutocompleteEdit(slotProps.index, column.id, $event)"
        />
        <p-dropdown
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-dropdown'"
          :options="dropdownOptions[column.id]"
          optionLabel="label"
          optionValue="value"
          :value="slotProps.data.data[column.id]"
          :showClear="true"
          :placeholder="$t('components.dropdown.placeholder')"
          @change="onDropdownEdit(slotProps.index, column.id, $event)"
        />
        <component
          v-else
          :is="getComponentEditableColumn(column.column_type_id)"
          v-model="slotProps.data.data[column.id]"
          :value="slotProps.data.data[column.id]"
          @input="onCellEdit($event, slotProps)"
        />
      </template>
      <template
        #body="slotProps"
      >
        {{
          getValue(column, slotProps.data.data[column.id])
        }}
      </template>
    </p-column>

  </p-datatable>

</template>

<script>
import Vue from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Calendar from 'primevue/calendar'
import Column from 'primevue/column'
import InputSwitch from 'primevue/inputswitch'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { patchTableData } from '@/store/database'
import lckClient from '@/services/lck-api'

export default {
  name: 'LCKRowDatatable',
  components: {
    'p-autocomplete': Vue.extend(AutoComplete),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-datatable': Vue.extend(DataTable),
    'p-calendar': Vue.extend(Calendar),
    'p-column': Vue.extend(Column)
  },
  props: {
    block: {
      type: Object,
      required: true
    },
    dropdownOptions: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editingCellRows: [],
      autocompleteItems: null,
      autocompleteValue: '',
      autocompleteInput: ''
    }
  },
  methods: {
    getValue (column, data = '') {
      if (
        data === '' ||
        data === null
      ) return ''
      switch (column.column_type_id) {
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.LOOKED_UP_COLUMN:
        case COLUMN_TYPE.FORMULA:
          return data.value
        case COLUMN_TYPE.SINGLE_SELECT:
          return column.settings.values[data]?.label
        case COLUMN_TYPE.DATE:
          return data ? data.substring(0, 10) : ''
        default:
          return data
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
    // eslint-disable-next-line @typescript-eslint/camelcase
    async searchItems ({ column_type_id, settings }, { query }) {
      this.$emit('update-suggestions', column_type_id, settings, this.autocompleteInput)
      // eslint-disable-next-line @typescript-eslint/camelcase
      if (column_type_id === COLUMN_TYPE.USER) {
        const result = await lckClient.service('user').find({
          query: {
            blocked: false,
            $or: {
              // eslint-disable-next-line @typescript-eslint/camelcase
              first_name: {
                $ilike: `%${this.autocompleteInput}%`
              },
              // eslint-disable-next-line @typescript-eslint/camelcase
              last_name: {
                $ilike: `%${this.autocompleteInput}%`
              }
            }
          }
        })
        this.autocompleteItems = result.data.map(d => ({
          label: d.first_name + ' ' + d.last_name,
          value: d.id
        }))
      // eslint-disable-next-line @typescript-eslint/camelcase
      } else if (column_type_id === COLUMN_TYPE.GROUP) {
        const result = await lckClient.service('group').find({
          query: {
            name: {
              $ilike: `%${query}%`
            }
          }
        })
        this.autocompleteItems = result.data.map(d => ({
          label: d.name,
          value: d.id
        }))
      // eslint-disable-next-line @typescript-eslint/camelcase
      } else if (column_type_id === COLUMN_TYPE.RELATION_BETWEEN_TABLES) {
        const result = await lckClient.service('row').find({
          query: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            table_id: settings.tableId,
            text: {
              $ilike: `%${query}%`
            }
          }
        })
        this.autocompleteItems = result.data.map(d => ({
          label: d.text,
          value: d.id
        }))
      }
    },
    logInput (event) {
      console.log(event)
    },
    onColumnResize (header) {
      console.log(header.delta, header.element, header.element.querySelector('[data-column-id]').attributes['data-column-id'].value)
      this.$emit(
        'column-resize',
        header.element.offsetWidth,
        header.element.querySelector('[data-column-id]').attributes['data-column-id'].value
      )
    },
    async onDropdownEdit (rowIndex, columnId, event) {
      const currentRow = this.block.content.data[rowIndex]
      this.$emit('update-cell', currentRow.id, columnId, event.value)
      const res = await patchTableData(currentRow.id, {
        data: { [columnId]: event.value }
      })
      currentRow.data = res.data
    },
    async onAutocompleteEdit (rowIndex, columnId, event) {
      const currentRow = this.block.content.data[rowIndex]
      this.$emit('update-cell', currentRow.id, columnId, event.value.value)
      const res = await patchTableData(currentRow.id, {
        data: { [columnId]: event.value.value }
      })
      this.autocompleteInput = event.value.label
      currentRow.data = res.data
    },
    async onCellEditComplete (event) {
      if (!this.editingCellRows[event.index]) {
        return
      }
      await patchTableData(this.block.content.data[event.index].id, {
        data: { [event.field]: this.editingCellRows[event.index][event.field] }
      })
    },
    onCellEdit (newValue, props) {
      if (!this.editingCellRows[props.index]) {
        this.editingCellRows[props.index] = {}
        // this.editingCellRows[props.index] = { ...props.data } Todo:  === Update ?
      }
      this.editingCellRows[props.index][props.column.field] = newValue
    },
    onVirtualScroll (event) {
      this.$emit('updateContentBlockTableView', event)
    },
    onSort (event) {
      this.$emit(
        'sort',
        {
          field: event.sortField,
          order: event.sortOrder
        }
      )
    }
  }
}
</script>

<style scoped>
/deep/.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td,
/deep/.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td.p-editable-column.p-cell-editing {
  padding: unset !important;
}
/deep/.p-editable-column.p-cell-editing .p-dropdown {
  border: unset;
  border-radius: 0;
}
.loading-text {
  height: 24px;
}
</style>
