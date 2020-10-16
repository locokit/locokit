<template>
  <div class="action-bar">
    <p-button
      type="button"
      icon="pi pi-filter"
      :label="$t('components.crudtable.toolbar.filters.name')"
      :badge="`${this.filters.length}`"
      @click="toggleFiltersPanel"
    />
    <p-overlay-panel ref="filtersPanel" appendTo="body">
      <div>
        <div>
          <div
            class="container p-d-flex"
            v-if="filters.length > 0"
          >
            <div
              class="filter-row p-formgroup-inline p-jc-end"
              v-for="(filter, index) in filters"
              :key="`filter-${index}`"
            >
              <div
                v-if="filters.length > 1 && index !== 0"
                class="p-field"
              >
                <label for="operator">{{ $t('components.crudtable.toolbar.filters.form.operator') }}</label>
                <p-dropdown
                  id="operator"
                  :options="operators"
                  optionLabel="label"
                  optionValue="value"
                  v-model="filter.operator"
                  :disabled="index !== 1"
                  @change="oneOperatorToRuleAll"
                >
                  <template #value="slotProps">
                    {{ $t(`components.crudtable.toolbar.filters.select.operator.${slotProps.value}`) }}
                  </template>
                  <template #option="slotProps">
                    {{ $t(`components.crudtable.toolbar.filters.select.operator.${slotProps.option.value}`) }}
                  </template>
                </p-dropdown>
              </div>
              <div class="p-field">
                <label for="column">{{ $t('components.crudtable.toolbar.filters.form.column') }}</label>
                <p-dropdown
                  id="column"
                  :options="columns"
                  optionLabel="label"
                  :placeholder="$t('components.crudtable.toolbar.filters.form.placeholder')"
                  v-model="filter.column"
                />
              </div>
              <div
                class="p-field"
              >
                <label for="action">{{ $t('components.crudtable.toolbar.filters.form.action') }}</label>
                <p-dropdown
                  id="action"
                  type="text"
                  :options="actions"
                  optionLabel="label"
                  optionValue="value"
                  v-model="filter.action"
                  :placeholder="$t('components.crudtable.toolbar.filters.form.placeholder')"
                >
                  <template #value="slotProps">
                    {{ slotProps.value ? $t(`components.crudtable.toolbar.filters.select.action.${slotProps.value}`) : slotProps.placeholder }}
                  </template>
                  <template #option="slotProps">
                    {{ $t(`components.crudtable.toolbar.filters.select.action.${slotProps.option.value}`) }}
                  </template>
                </p-dropdown>
              </div>
              <div
                class="p-field"
              >
                <label for="motif">{{ $t('components.crudtable.toolbar.filters.form.motif') }}</label>
                <p-input-text
                  id="motif"
                  type="text"
                  v-model="filter.motif"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <p>{{ $t('components.crudtable.toolbar.filters.noFilters') }}</p>
          </div>
          <p-toolbar>
            <template slot="left">
              <p-button
                class="p-mr-2 p-button-outlined"
                type="button"
                icon="pi pi-plus-circle"
                :label="$t('components.crudtable.toolbar.filters.action.addFilter')"
                @click="addFilter"
              />
              <p-button
                v-if="this.filters.length > 0"
                class="p-button-outlined"
                type="button"
                icon="pi pi-undo"
                :label="$t('form.reset')"
                @click="resetFilters"
              />
            </template>
            <template slot="right">
              <p-button
                class="p-mr-2 p-button-outlined"
                type="button"
                icon="pi pi-check-circle"
                :label="$t('form.submit')"
                @click="submitFilters"
                :disabled="this.filters.length === 0"
              />
              <p-button
                class="p-button-outlined"
                type="button"
                icon="pi pi-times-circle"
                :label="$t('components.crudtable.toolbar.filters.action.close')"
                @click="toggleFiltersPanel"
              />
            </template>
          </p-toolbar>
        </div>
      </div>
    </p-overlay-panel>
  </div>
</template>

<script>
import Vue from 'vue'
import Dropdown from 'primevue/dropdown'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import OverlayPanel from 'primevue/overlaypanel'

import { COLUMN_TYPE } from '@locokit/lck-glossary'

const OPERATORS = [{
  label: 'or',
  value: '$or'
}, {
  label: 'and',
  value: '$and'
}]

const ACTIONS = [{
  label: 'match',
  value: '$ilike'
}, {
  label: 'does not match',
  value: '$notILike'
}, {
  label: 'is equal to',
  value: '$eq'
}, {
  label: 'is different than',
  value: '$ne'
// }, {
//   label: 'is empty',
//   value: 'and'
// }, {
//   label: 'is not empty',
//   value: 'and'
// }, {
//   label: 'is greater than',
//   value: '$gte'
// }, {
//   label: 'is less than',
//   value: '$lte'
}]

export default {
  name: 'ActionBar',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
    'p-overlay-panel': Vue.extend(OverlayPanel),
    'p-toolbar': Vue.extend(Toolbar)
  },
  props: {
    defintionColumn: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      filters: [],
      operators: OPERATORS,
      actions: ACTIONS,
      selectedOperator: OPERATORS[0].value
    }
  },
  computed: {
    columns () {
      return this.defintionColumn.reduce((acc, { text, id, column_type_id: columnTypeId }) => {
        // Todo : In fine this condition will be remove. When all type will be filterable.
        if (columnTypeId === COLUMN_TYPE.STRING) {
          acc.push({ value: id, label: text, type: columnTypeId })
        }
        return acc
      }, [])
    }
  },
  methods: {
    // getComponentColumn (columnTypeId) {
    //   switch (columnTypeId) {
    //     case COLUMN_TYPE.STRING:
    //       return 'p-input-text'
    //     case COLUMN_TYPE.BOOLEAN:
    //       return 'p-input-switch'
    //     case COLUMN_TYPE.NUMBER:
    //     case COLUMN_TYPE.FLOAT:
    //       return 'p-input-number'
    //     default:
    //       return 'disable'
    //   }
    // },
    toggleFiltersPanel (event) {
      this.$refs.filtersPanel.toggle(event)
    },
    resetFilters () {
      this.filters = []
      this.$emit('input', this.filters)
    },
    submitFilters () {
      this.$emit('input', this.filters)
      this.$refs.filtersPanel.hide()
    },
    addFilter () {
      this.filters.push({
        operator: this.selectedOperator,
        column: null,
        action: null,
        motif: null
      })
    },
    oneOperatorToRuleAll (event) {
      this.selectedOperator = event.value
      if (this.filters.length > 1) {
        this.filters.forEach(filter => (filter.operator = this.selectedOperator))
      }
    }
  }
}
</script>

<style scoped>
/deep/ .p-overlaypanel-content {
  min-width: 650px;
}
</style>
