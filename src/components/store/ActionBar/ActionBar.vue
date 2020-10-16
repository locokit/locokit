<template>
  <div class="action-bar">
    <p-button
      type="button"
      icon="pi pi-filter"
      label="Filters"
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
                <label for="operator">Operator</label>
                <p-dropdown
                  id="operator"
                  dataKey="and"
                  :options="operators"
                  optionLabel="label"
                  optionValue="value"
                  v-model="filter.operator"
                  :disabled="index !== 1"
                  @change="oneOperatorToRuleAll"
                />
              </div>
              <div class="p-field">
                <label for="column">Column</label>
                <p-dropdown
                  id="column"
                  :options="columns"
                  optionLabel="label"
                  v-model="filter.column"
                />
              </div>
              <div
                class="p-field"
              >
                <label for="action">Action</label>
                <p-dropdown
                  id="action"
                  type="text"
                  :options="actions"
                  optionLabel="label"
                  optionValue="value"
                  v-model="filter.action"
                />
              </div>
              <div
                class="p-field"
              >
                <label for="motif">Motif</label>
                <p-input-text
                  id="motif"
                  type="text"
                  v-model="filter.motif"
                  :disabled="filter.column && filter.column.type && getComponentColumn(filter.column.type) !== 'p-input-text'"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <p>Aucun filtre n'est appliqué.</p>
          </div>
          <p-toolbar>
            <template slot="left">
              <p-button
                class="p-mr-2 p-button-outlined"
                type="button"
                icon="pi pi-plus-circle"
                label="Add filter"
                @click="addFilter"
              />
              <p-button
                v-if="this.filters.length > 0"
                class="p-button-outlined"
                type="button"
                icon="pi pi-undo"
                label="Reset filter"
                @click="resetFilters"
              />
            </template>
            <template slot="right">
              <p-button
                class="p-mr-2 p-button-outlined"
                type="button"
                icon="pi pi-check-circle"
                label="Submit"
                @click="submitFilters"
                :disabled="this.filters.length === 0"
              />
              <p-button
                class="p-button-outlined"
                type="button"
                icon="pi pi-times-circle"
                label="Close"
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
  label: 'OR',
  value: '$or'
}, {
  label: 'AND',
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
// }, {
//   label: 'is different than',
//   value: '$ne'
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
      // eslint-disable-next-line @typescript-eslint/camelcase
      return this.defintionColumn.map(({ text, id, column_type_id }) => ({ value: id, label: text, type: column_type_id }))
    }
  },
  methods: {
    getComponentColumn (columnTypeId) {
      switch (columnTypeId) {
        case COLUMN_TYPE.STRING:
          return 'p-input-text'
        default:
          return 'disable'
      }
    },
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
    hidehide () {
      console.log('bouh')
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
