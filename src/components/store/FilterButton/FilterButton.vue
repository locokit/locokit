<template>
  <div class="filter-button">
    <p-button
      type="button"
      class="p-ml-2"
      icon="pi pi-filter"
      :label="$t('components.crudtable.toolbar.filters.name')"
      :badge="`${value.length}`"
      @click="toggleFiltersPanel"
    />
    <p-overlay-panel
      ref="filtersPanel"
      appendTo="body"
    >
      <div
        class="p-mb-2 filters-listing"
        v-if="value.length > 0"
      >
        <div
          class="p-ai-center p-md-12 p-formgroup-inline p-mb-1"
          v-for="(filter, index) in value"
          :key="`filter-${index}`"
        >
          <div
            class="p-col-fixed p-p-0 p-mr-2"
            :style="{
              width: '2rem'
            }"
          >
            <p-button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text p-button-sm"
              @click="removeFilter(filter)"
            />
          </div>
          <div
            class="p-col-fixed p-p-0 p-mr-2"
            :style="{
              width: '5rem'
            }"
          >
            <label for="operator" v-if="index > 0">
              {{ $t('components.crudtable.toolbar.filters.form.operator') }}
            </label>
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
                {{ $t(`components.crudtable.toolbar.filters.select.operator.${slotProps.value}`) }}
              </template>
              <template #option="slotProps">
                {{ $t(`components.crudtable.toolbar.filters.select.operator.${slotProps.option.value}`) }}
              </template>
            </p-dropdown>
          </div>
          <div class="p-col p-md-3 p-mr-2">
            <label for="column">
              {{ $t('components.crudtable.toolbar.filters.form.column') }}
            </label>
            <p-dropdown
              id="column"
              :options="columns"
              optionLabel="label"
              :placeholder="$t('components.crudtable.toolbar.filters.form.placeholder')"
              @change="onChangeColumn(index)"
              v-model="filter.column"
            />
          </div>
          <div
            class="p-col-12 p-md-2 p-mr-2"
          >
            <label for="action">
              {{ $t('components.crudtable.toolbar.filters.form.action') }}
            </label>
            <p-dropdown
              id="action"
              type="text"
              :options="filter.column && getColumnFilterConfig(filter.column.type).actions || []"
              :disabled="!filter.column"
              optionLabel="label"
              v-model="filter.action"
              :placeholder="$t('components.crudtable.toolbar.filters.form.placeholder')"
              @change="actionControlPattern(index, $event)"
            >
              <template #value="slotProps">
                {{ slotProps.value ? $t(`components.crudtable.toolbar.filters.select.action.${slotProps.value.label}`) : slotProps.placeholder }}
              </template>
              <template #option="slotProps">
                {{ $t(`components.crudtable.toolbar.filters.select.action.${slotProps.option.label}`) }}
              </template>
            </p-dropdown>
          </div>
          <div
            class="p-col"
            v-if="filter.action && filter.action.predefinedPattern === undefined"
          >
            <label for="pattern">{{ $t('components.crudtable.toolbar.filters.form.pattern') }}</label>
            <component
              id="pattern"
              :is="getComponentEditableColumn(filter.column.type) || 'p-input-text'"
              v-bind="getColumnFilterConfig(filter.column.type).patternComponentOptions || {}"
              v-model="filter.pattern"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <p>{{ $t('components.crudtable.toolbar.filters.noFilters') }}</p>
      </div>
      <div class="p-d-flex">
        <p-button
          class="p-button-outlined p-mr-2"
          type="button"
          icon="pi pi-plus-circle"
          :label="$t('components.crudtable.toolbar.filters.action.addFilter')"
          @click="addFilter"
        />
        <p-button
          v-if="value.length > 0"
          class="p-button-outlined"
          type="button"
          icon="pi pi-undo"
          :label="$t('form.reset')"
          @click="resetFilters"
        />
        <p-button
          class="p-button-primary p-ml-auto"
          type="button"
          icon="pi pi-check-circle"
          :label="$t('form.submit')"
          @click="submitFilters"
          :disabled="value.length === 0 || value.some(({ column, action, pattern }) => (column === null) || (action === null) || (pattern === null))"
        />
      </div>
    </p-overlay-panel>
  </div>
</template>

<script>
import Vue from 'vue'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import OverlayPanel from 'primevue/overlaypanel'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { getComponentEditableColumn } from '@/utils/columns'

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
    label: 'isDifferentThan',
    value: '$ne'
  },
  EMPTY: {
    label: 'isEmpty',
    value: '$null',
    predefinedPattern: true
  },
  NOT_EMPTY: {
    label: 'isNotEmpty',
    value: '$null',
    predefinedPattern: false
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
// A "patternComponentOptions" attribute (object) can be added to customize the pattern component
const COLUMN_TYPE_FILTERS_CONFIG = {
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
      ACTIONS.MATCH,
      ACTIONS.NOT_MATCH,
      ACTIONS.EQUAL,
      ACTIONS.NOT_EQUAL,
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
    patternComponentOptions: { minFractionDigits: 2 }
  }
}

const SUPPORTED_TYPES = Object.keys(COLUMN_TYPE_FILTERS_CONFIG).map(action => parseInt(action))

export default {
  name: 'LCKFilterButton',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-float': Vue.extend(InputNumber),
    'p-button': Vue.extend(Button),
    'p-overlay-panel': Vue.extend(OverlayPanel)
  },
  props: {
    definitionColumn: {
      type: Array,
      required: false,
      default: () => ([])
    },
    value: {
      type: Array,
      required: false,
      default: () => ([])
    }
  },
  data () {
    return {
      // value: [],
      operators: OPERATORS,
      selectedOperator: OPERATORS[0].value
    }
  },
  computed: {
    columns () {
      if (this.definitionColumn?.length < 1) return []
      return this.definitionColumn.reduce((acc, { text, id, column_type_id: columnTypeId }) => {
        // Todo : In fine this condition will be remove. When all type will be filterable.
        if (SUPPORTED_TYPES.includes(columnTypeId)) {
          acc.push({ value: id, label: text, type: columnTypeId })
        }
        return acc
      }, [])
    }
  },
  methods: {
    getComponentEditableColumn,
    getColumnFilterConfig (columnType) {
      return COLUMN_TYPE_FILTERS_CONFIG[columnType] || {}
    },
    toggleFiltersPanel (event) {
      this.$refs.filtersPanel.toggle(event)
    },
    removeFilter (filterToRemove) {
      this.$emit('input', this.value.filter(f => (f !== filterToRemove)))
    },
    resetFilters () {
      this.$emit('reset')
      this.$refs.filtersPanel.hide()
    },
    submitFilters () {
      this.$emit('submit')
      this.$refs.filtersPanel.hide()
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
    actionControlPattern (index, { value: { predefinedPattern } = {} }) {
      this.value[index].pattern = predefinedPattern !== undefined ? predefinedPattern : null
    }
  }
}
</script>

<style scoped>
.p-overlaypanel {
  width: 700px;
}

label,
.input,
.p-inputwrapper {
  font-family: 'Raleway', sans-serif;
}

label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
}

.input,
.p-inputwrapper {
  max-width: 100%;
  width: 100%;
}

/deep/ .p-button .p-badge {
  line-height: 0.85rem;
  font-size: 0.9rem;
  color: var(--primary-color);
}

/deep/ .p-button {
  width: auto;
}

/deep/ .filters-listing .p-component,
/deep/ .filters-listing .p-inputtext,
/deep/ .filters-listing ul.p-dropdown-items,
/deep/ .filters-listing ul.p-dropdown-items li {
  font-size: 0.85rem;
}

</style>
