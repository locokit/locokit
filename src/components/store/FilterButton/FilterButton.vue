<template>
  <lck-overlaypanel
    icon="pi pi-filter"
    class-button="p-button-outlined p-button-secondary"
    :disabled="disabled"
    :label="$tc('components.datatable.toolbar.filters.label', value.length)"
    :appendTo="null"
  >
    <template #overlay-content="overlaySlotProps">
      <div
        class="p-mb-2 filters-listing"
        v-if="value.length > 0"
      >
        <div
          class="p-md-12 p-formgroup-inline p-mb-1"
          v-for="(filter, index) in value"
          :key="`filter-${index}`"
        >
          <div
            class="p-col-fixed p-p-0 p-mr-2 p-as-end"
            :style="{
              width: '2rem'
            }"
          >
            <p-button
              v-show="value.length > 1"
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text p-button-sm"
              @click.stop="removeFilter(filter)"
            />
          </div>
          <div
            class="p-col-fixed p-p-0 p-mr-2"
            :style="{
              width: '5rem'
            }"
          >
            <p-dropdown
              id="operator"
              :options="operators"
              optionLabel="label"
              optionValue="value"
              v-model="filter.operator"
              v-if="index > 0"
              :disabled="index > 1"
              @change="onChangeOperator"
            >
              <template #value="slotProps">
                {{ $t(`components.datatable.toolbar.filters.select.operator.${slotProps.value}`) }}
              </template>
              <template #option="slotProps">
                {{ $t(`components.datatable.toolbar.filters.select.operator.${slotProps.option.value}`) }}
              </template>
            </p-dropdown>
          </div>
          <div class="p-col p-md-3 p-mr-2">
            <label for="column" v-if="index === 0">
              {{ $t('components.datatable.toolbar.filters.form.column') }}
            </label>
            <p-dropdown
              id="column"
              :options="columnsDisplayable"
              optionLabel="label"
              :placeholder="$t('components.datatable.toolbar.filters.form.placeholder')"
              @change="onChangeColumn(index)"
              v-model="filter.column"
            />
          </div>
          <div
            class="p-col-12 p-md-3 p-mr-2"
          >
            <label for="action" v-if="index === 0">
              {{ $t('components.datatable.toolbar.filters.form.action') }}
            </label>
            <p-dropdown
              id="action"
              type="text"
              :options="filter.column && columnFiltersConfig[filter.column.type].actions || []"
              :disabled="!filter.column"
              optionLabel="label"
              :value="filter.action"
              :placeholder="$t('components.datatable.toolbar.filters.form.placeholder')"
              @change="actionControlPattern(index, $event)"
            >
              <template #value="slotProps">
                {{ slotProps.value ? $t(`components.datatable.toolbar.filters.select.action.${slotProps.value.label}`) : slotProps.placeholder }}
              </template>
              <template #option="slotProps">
                {{ $t(`components.datatable.toolbar.filters.select.action.${slotProps.option.label}`) }}
              </template>
            </p-dropdown>
          </div>
          <div
            class="p-col p-md-3"
            v-if="filter.action && filter.action.predefinedPattern === undefined"
          >
            <label for="pattern" v-if="index === 0">
              {{ $t('components.datatable.toolbar.filters.form.pattern') }}
            </label>
            <component
              id="pattern"
              :is="
                columnFiltersConfig[filter.column.type].patternComponent ||
                getComponentEditableColumn(filter.column.type)
              "
              :options="filter.column.dropdownOptions"
              v-bind="columnFiltersConfig[filter.column.type].patternComponentOptions || {}"
              v-model="filter.pattern"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <p>{{ $t('components.datatable.toolbar.filters.noFilters') }}</p>
      </div>
      <div class="p-d-flex">
        <p-button
          class="p-button-outlined p-mr-2"
          type="button"
          icon="pi pi-plus-circle"
          :label="$t('components.datatable.toolbar.filters.action.addFilter')"
          @click="addFilter"
        />
        <p-button
          v-if="value.length > 0"
          class="p-button-outlined"
          type="button"
          icon="pi pi-undo"
          :label="$t('form.reset')"
          @click="resetFilters(overlaySlotProps)"
        />
        <p-button
          class="p-button-primary p-ml-auto"
          type="button"
          icon="pi pi-check-circle"
          :label="$t('form.submit')"
          @click="submitFilters(overlaySlotProps)"
          :disabled="value.length === 0 || value.some(({ column, action, pattern }) => (column === null) || (action === null) || (pattern === null))"
        />
      </div>
    </template>
  </lck-overlaypanel>
</template>

<script>
import Vue from 'vue'
import i18n from '@/plugins/i18n'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import OverlayPanel from '@/components/ui/OverlayPanel/OverlayPanel'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { getComponentEditableColumn } from '@/services/lck-utils/columns'

// Available operators
const OPERATORS = [{
  label: 'or',
  value: '$or'
}, {
  label: 'and',
  value: '$and'
}]

// Available actions
// Each one must have a "label" used for translation and a "value" corresponding to the FeatherJS Query Operators.
// The "predefinedPattern" attribute is used to give a value to an implicit pattern.
const ACTIONS = {
  MATCH: {
    label: 'match',
    value: '$ilike'
  },
  NOT_MATCH: {
    label: 'doesNotMatch',
    value: '$notILike'
  },
  EQUAL: {
    label: 'isEqualTo',
    value: '$eq'
  },
  NOT_EQUAL: {
    label: 'isDifferentFrom',
    value: '$ne'
  },
  IN: {
    label: 'in',
    value: '$in'
  },
  NOT_IN: {
    label: 'notIn',
    value: '$nin'
  },
  ALL: {
    label: 'all',
    value: '$all'
  },
  ANY: {
    label: 'any',
    value: '$any'
  },
  EMPTY: {
    label: 'isEmpty',
    value: '$null',
    predefinedPattern: true
  },
  NOT_EMPTY: {
    label: 'isNotEmpty',
    value: '$notNull',
    predefinedPattern: true
  },
  TRUE: {
    label: 'isTrue',
    value: '$eq',
    predefinedPattern: true
  },
  FALSE: {
    label: 'isFalse',
    value: '$eq',
    predefinedPattern: false
  },
  GREATER_THAN: {
    label: 'isGreaterThan',
    value: '$gt'
  },
  LOWER_THAN: {
    label: 'isLowerThan',
    value: '$lt'
  },
  GREATER_EQUAL_THAN: {
    label: 'isGreaterThanOrEqualTo',
    value: '$gte'
  },
  LOWER_EQUAL_THAN: {
    label: 'isLowerThanOrEqualTo',
    value: '$lte'
  }
}

// Filterable types
// Each one must have an "actions" array.
// A "patternComponent" attribute (string) can be added to replace the default pattern component (coming from "getComponentEditableColumn")
// A "patternComponentOptions" attribute (object) can be added to customize the pattern component
const COLUMN_FILTERS_CONFIG = {
  [COLUMN_TYPE.BOOLEAN]: {
    actions: [
      ACTIONS.TRUE,
      ACTIONS.FALSE,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY
    ]
  },
  [COLUMN_TYPE.STRING]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY
    ]
  },
  [COLUMN_TYPE.NUMBER]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.LOWER_THAN,
      ACTIONS.LOWER_EQUAL_THAN,
      ACTIONS.GREATER_THAN,
      ACTIONS.GREATER_EQUAL_THAN
    ]
  },
  [COLUMN_TYPE.FLOAT]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.LOWER_THAN,
      ACTIONS.LOWER_EQUAL_THAN,
      ACTIONS.GREATER_THAN,
      ACTIONS.GREATER_EQUAL_THAN
    ],
    patternComponent: 'p-input-number',
    patternComponentOptions: { minFractionDigits: 2 }
  },
  [COLUMN_TYPE.RELATION_BETWEEN_TABLES]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY
    ],
    patternComponent: 'p-input-text'
  },
  [COLUMN_TYPE.SINGLE_SELECT]: {
    actions: [
      ACTIONS.IN,
      ACTIONS.NOT_IN,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY
    ],
    patternComponentOptions: {
      optionLabel: 'label',
      optionValue: 'value',
      appendTo: null
    },
    patternComponent: 'lck-multiselect'
  },
  [COLUMN_TYPE.MULTI_SELECT]: {
    actions: [
      ACTIONS.ALL,
      ACTIONS.ANY,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY
    ],
    patternComponentOptions: {
      optionLabel: 'label',
      optionValue: 'value',
      appendTo: null
    }
  },
  [COLUMN_TYPE.LOOKED_UP_COLUMN]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY
    ],
    patternComponent: 'p-input-text'
  },
  [COLUMN_TYPE.DATE]: {
    actions: [
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
      { ...ACTIONS.LOWER_THAN, label: 'isEarlierThan' },
      { ...ACTIONS.LOWER_EQUAL_THAN, label: 'isEarlierThanOrEqualTo' },
      { ...ACTIONS.GREATER_THAN, label: 'isLaterThan' },
      { ...ACTIONS.GREATER_EQUAL_THAN, label: 'isLaterThanOrEqualTo' },
      ACTIONS.EMPTY,
      ACTIONS.NOT_EMPTY
    ],
    patternComponentOptions: {
      dateFormat: i18n.t('date.dateFormatPrime'),
      locale: i18n.t('date.localePrime')
    }
  }
}

export default {
  name: 'LckFilterButton',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-input-number': Vue.extend(InputNumber),
    'p-calendar': Vue.extend(Calendar),
    'p-button': Vue.extend(Button),
    'lck-multiselect': MultiSelect,
    'lck-overlaypanel': Vue.extend(OverlayPanel)
  },
  props: {
    definition: {
      type: Object,
      required: false,
      default: () => ({
        columns: []
      })
    },
    columnsDropdownOptions: {
      type: Object,
      required: false,
      default: () => ({})
    },
    value: {
      type: Array,
      required: false,
      default: () => ([])
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      columnFiltersConfig: COLUMN_FILTERS_CONFIG,
      operators: OPERATORS,
      selectedOperator: OPERATORS[0].value
    }
  },
  computed: {
    columnsDisplayable () {
      if (this.definition.columns?.length < 1) return []
      return this.definition.columns.reduce((acc, { text, id, column_type_id: columnTypeId }) => {
        // Todo : In fine this condition will be remove. When all type will be filterable.
        if (this.supportedTypes.includes(columnTypeId)) {
          acc.push({
            value: id,
            label: text,
            type: columnTypeId,
            dropdownOptions: this.columnsDropdownOptions[id]
          })
        }
        return acc
      }, [])
    },
    supportedTypes () {
      return Object.keys(this.columnFiltersConfig).map(action => parseInt(action))
    }
  },
  methods: {
    getComponentEditableColumn,
    removeFilter (filterToRemove) {
      this.$emit('input', this.value.filter(f => (f !== filterToRemove)))
    },
    resetFilters (overlaySlotProps) {
      this.$emit('reset')
      overlaySlotProps.toggleOverlayPanel()
    },
    submitFilters (overlaySlotProps) {
      this.$emit('submit')
      overlaySlotProps.toggleOverlayPanel()
    },
    addFilter () {
      this.value.push({
        operator: this.selectedOperator,
        column: null,
        action: null,
        pattern: null
      })
    },
    onChangeOperator (event) {
      this.selectedOperator = event.value
      if (this.value.length > 1) {
        this.value.forEach(filter => (filter.operator = this.selectedOperator))
      }
    },
    onChangeColumn (index) {
      this.value[index].action = null
      this.value[index].pattern = null
    },
    actionControlPattern (index, { value }) {
      if (value?.predefinedPattern) {
        // Set the pattern if the selected action has a predefined one
        this.value[index].pattern = value.predefinedPattern
      } else {
        if (this.value[index].action?.predefinedPattern) {
          // Reset the pattern if the previous action had a predefined one
          this.value[index].pattern = null
        }
      }
      // Set the action
      this.value[index].action = value
    }
  }
}
</script>

<style scoped>
label,
.input,
.p-inputwrapper {
  font-family: 'Raleway', sans-serif;
}

label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
}

.input,
.p-inputwrapper {
  max-width: 100%;
  width: 100%;
  line-height: normal;
}

/deep/ .p-dropdown-label.p-inputtext {
  line-height: normal;
}

/deep/ .p-button {
  width: auto;
}

.filters-listing {
  width: 700px;
}

/* .filters-listing .p-component,
.filters-listing .p-inputtext,
.filters-listing .p-dropdown,
.filters-listing ul.p-dropdown-items,
.filters-listing ul.p-dropdown-items li {
  font-size: 0.85rem;
} */

</style>
