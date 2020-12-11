<template>
  <div
    class="p-fluid p-pb-6"
    v-if="row"
  >
    <h3> {{ row.text }} </h3>
    <div
      class="p-field"
      v-for="column in definition.columns"
      :key="column.id"
    >
      <label :for="column.id">{{ column.text }}</label>

      <div v-if="editableColumns.indexOf(column) > -1">
        <lck-autocomplete
          v-if="getComponentEditableColumn(column.column_type_id) === 'lck-autocomplete'"
          :id="column.id"
          :dropdown="true"
          :placeholder="$t('components.datatable.placeholder')"
          field="label"
          :suggestions="autocompleteSuggestions"
          @search="onComplete(column, $event)"
          v-model="autocompleteInput[column.id]"
          @item-select="onAutocompleteEdit(row.id, column.id, $event)"
          @clear="onAutocompleteEdit(row.id, column.id, null)"
        />
        <p-dropdown
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-dropdown'"
          :id="column.id"
          :options="columnsEnhanced[column.id].dropdownOptions"
          optionLabel="label"
          optionValue="value"
          :showClear="true"
          :placeholder="$t('components.datatable.placeholder')"
          v-model="row.data[column.id]"
          @input="onEdit(row.id, column.id, $event)"
        />
        <lck-multiselect
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'lck-multiselect'"
          :id="column.id"
          :options="columnsEnhanced[column.id].dropdownOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('components.datatable.placeholder')"
          v-model="row.data[column.id]"
          @input="onEdit(row.id, column.id, $event)"
        />
        <p-calendar
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-calendar'"
          :id="column.id"
          :dateFormat="$t('date.dateFormatPrime')"
          v-model="row.data[column.id]"
          @input="onDateEdit(row.id, column.id, $event)"
          appendTo="body"
        />
        <p-input-number
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-input-float'"
          v-model="row.data[column.id]"
          @blur="onEdit(row.id, column.id, row.data[column.id])"
          mode="decimal"
          :minFractionDigits="2"
        />
        <component
          v-else
          :is="getComponentEditableColumn(column.column_type_id)"
          :id="column.id"
          v-model="row.data[column.id]"
          @blur="onEdit(row.id, column.id, row.data[column.id])"
        />
      </div>

      <div
        v-else
        class="p-fluid p-inputtext p-component"
        style="height: 2.5rem; border: unset; background-color: transparent; padding-left: unset;"
        disabled
      >
        {{ getColumnDisplayValue(column, row.data[column.id]) }}
      </div>

    </div>
  </div>
  <div v-else>
    {{ $t('components.datadetail.nodata') }}
  </div>
</template>

<script>
import Vue from 'vue'

import Dropdown from 'primevue/dropdown'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import InputURL from '@/components/ui/InputURL/InputURL.vue'
import { getComponentEditableColumn, isEditableColumn } from '@/services/lck-utils/columns'
import { formatISO } from 'date-fns'
import { lckHelpers } from '@/services/lck-api'

export default {
  name: 'LckDataDetail',
  props: {
    autocompleteSuggestions: {
      type: Array
    },
    row: {
      type: Object,
      required: false
    },
    definition: {
      type: Object,
      required: false,
      default: () => ({ columns: [] })
    },
    crudMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      autocompleteInput: {}
    }
  },
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-filter-button': FilterButton,
    'lck-multiselect': MultiSelect,
    'lck-input-url': InputURL,
    'p-dialog': Vue.extend(Dialog),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-calendar': Vue.extend(Calendar),
    'p-toolbar': Vue.extend(Toolbar),
    'p-button': Vue.extend(Button)
  },
  computed: {
    currentBlockDropdownOptions () {
      const result = {}
      this.definition.columns.forEach(currentColumn => {
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
      if (!this.definition.columns) return []
      return this.definition.columns.filter(c => this.isEditableColumn(this.crudMode, c))
    },
    columnsEnhanced () {
      if (!this.definition.columns) return {}
      const result = {}
      this.definition.columns.forEach(currentColumn => {
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
    isEditableColumn,
    getColumnDisplayValue: lckHelpers.getColumnDisplayValue,
    // eslint-disable-next-line @typescript-eslint/camelcase
    onComplete ({ column_type_id, settings }, { query }) {
      this.$emit(
        'update-suggestions', {
        // eslint-disable-next-line @typescript-eslint/camelcase
          column_type_id,
          settings
        }, { query })
    },
    async onAutocompleteEdit (rowId, columnId, event = null) {
      await this.onEdit(rowId, columnId, event ? event.value.value : null)
    },
    async onDateEdit (rowId, columnId, value) {
      await this.onEdit(
        rowId,
        columnId,
        value ? formatISO(value, { representation: 'date' }) : null
      )
    },
    async onEdit (rowId, columnId, value) {
      this.$emit('update-row', {
        rowId,
        columnId,
        newValue: value
      })
    }
  },
  watch: {
    row: {
      handler (newRef, oldRef) {
        if (newRef !== oldRef) {
          /**
         * we go through every data prop,
         * and init the autocompleteInput if needed
         */
          if (newRef.data) {
            this.autocompleteInput = {}
            Object.keys(newRef.data).forEach((columnId) => {
              const currentColumnDefinition = this.columnsEnhanced[columnId]
              switch (currentColumnDefinition.column_type_id) {
                case COLUMN_TYPE.USER:
                case COLUMN_TYPE.GROUP:
                case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                  this.$set(this.autocompleteInput, columnId, newRef.data[columnId]?.value || null)
                  break
              }
            })
          }
        }
      },
      immediate: true
    }
  }
}
</script>
