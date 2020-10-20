<template>
  <div class="action-bar">
    <p-button
      type="button"
      class="button-filter"
      icon="pi pi-filter"
      :label="$t('components.crudtable.toolbar.filters.name')"
      :badge="`${this.filters.length}`"
      @click="toggleFiltersPanel"
    />
    <p-overlay-panel ref="filtersPanel" appendTo="body">
      <div>
        <div>
          <div
            class="container"
            v-if="filters.length > 0"
          >
            <div class="form-container">
              <div
                class="filter-row p-md-12 p-formgroup-inline"
                v-for="(filter, index) in filters"
                :key="`filter-${index}`"
              >
                <div
                  class="p-field p-d-inline-flex p-sm-6 p-md-1 select-filter"
                >
                  <p-checkbox
                    :id="`filter-${index}`"
                    name="filter"
                    :value="{filter, id: index}"
                    v-model="filtersRemoved"
                  >
                  </p-checkbox>
                  <label :for="`filter-${index}`" class="remove-filter"><i class="pi pi-times"></i></label>
                </div>
                <div
                  v-if="filters.length > 1 && index !== 0"
                  class="p-field p-col-6 p-md-2"
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
                <div
                  class="p-field p-col-12 p-md-3"
                  :class="index === 0 && 'p-offset-0 p-md-offset-2'"
                >
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
                  class="p-field p-col-12 p-md-2"
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
                    @change="actionControlMotif(index, $event)"
                  >
                    <template #value="slotProps">
                      {{
                        slotProps.value ? $t(`components.crudtable.toolbar.filters.select.action.${slotProps.value}`) : slotProps.placeholder
                      }}
                    </template>
                    <template #option="slotProps">
                      {{ $t(`components.crudtable.toolbar.filters.select.action.${slotProps.option.value}`) }}
                    </template>
                  </p-dropdown>
                </div>
                <div
                  class="p-field p-col-12 p-md-4"
                  v-if="!['$null', '$notNull'].includes(filter.action)"
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
          </div>
          <div v-else>
            <p>{{ $t('components.crudtable.toolbar.filters.noFilters') }}</p>
          </div>
          <p-toolbar>
            <template slot="left">
              <p-button
                class="p-button-outlined"
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
                class="p-button-primary"
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
import Checkbox from 'primevue/checkbox'

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
}, {
  label: 'is empty',
  value: '$null'
}, {
  label: 'is not empty',
  value: '$notNull'
// }, {
//   label: 'is greater than',
//   value: '$gte'
// }, {
//   label: 'is less than',
//   value: '$lte'
}]

export default {
  name: 'FilterButton',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
    'p-checkbox': Vue.extend(Checkbox),
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
      filtersRemoved: [],
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
      if (this.filtersRemoved.length > 0) {
        this.filtersRemoved.forEach(elem => {
          const found = this.filters.indexOf(elem.filter)
          this.filters.splice(found, 1)
        })
      }
      this.$emit('input', this.filters)
      if (this.filtersRemoved.length === 0 && this.filters.length > 0) {
        this.$refs.filtersPanel.hide()
      }
      this.filtersRemoved = []
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
    },
    actionControlMotif (index, event) {
      if (event.value === '$null') {
        this.filters[index].motif = true
      } else if (event.value === '$notNull') {
        this.filters[index].motif = false
      }
    }
  }
}
</script>

<style scoped>
.filter-row {
  width: 100%;
  align-items: center;
  margin-bottom: 0.5rem;
  align-items: center;
}

.p-formgroup-inline .p-field {
  margin-right: 0;
}

.filter-row .p-field {
  margin-bottom: 0.15rem;
  padding-right: 0.30rem;
}

.filter-row .p-field:last-of-type {
  margin-bottom: 0.15rem;
  padding-right: 0rem;
}

.filter-row .p-field label {
  font-family: 'Raleway', sans-serif;
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
}

.filter-row .p-field:last-of-type {
  margin-right: 0;
}

.button-filter {
  margin-left: 0.5rem;
}

/deep/ .button-filter .p-badge {
  line-height: 0.85rem;
  font-size: 0.9rem;
}

.input,
.p-inputwrapper {
  max-width: 100%;
  width: 100%;
}

.input,
.p-inputwrapper {
  font-family: 'Raleway', sans-serif;
}

/deep/ .filter-row .p-component,
/deep/ .filter-row .p-inputtext,
/deep/ .filter-row ul.p-dropdown-items,
/deep/ .filter-row ul.p-dropdown-items li {
  font-size: 0.85rem;
}

.p-overlaypanel {
  width: 60%;
}

p.filter-row .remove-filter {
  margin: 0;
  width: 1rem;
  padding: 0.5rem;
  border: 1px solid red;
}

/deep/ .p-toolbar-group-left button,
/deep/ .p-toolbar-group-right button {
  width: 100%;
  white-space: nowrap;
  padding-right: 1rem;
}

/deep/ .p-toolbar-group-left button:first-of-type,
/deep/ .p-toolbar-group-right button:first-of-type {
  width: 100%;
  margin-right: 0.5rem;
}

/deep/ .select-filter .p-checkbox-box {
  display: none;
  visibility: hidden;
  border: 1px solid;
}

.select-filter label i {
  text-rendering: optimizeLegibility;
  padding: 0.25rem 0rem;
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  line-height: 0.85rem;
  border: 1px solid red;
  color: red;
  border-radius: 0.75rem;
  transition: all 0.5s;
}

.select-filter label:hover i {
  color: white;
  background-color: rgba(255, 0, 0, 0.7);
  border-color: rgba(255,0,0,0);
  transform: scale(1.2);
}

/deep/ .select-filter .p-checkbox-checked + label i {
  text-rendering: optimizeLegibility;
  color: white;
  background-color: red;
  border: 1px solid red;
  border-radius: 0.75rem;
}

@media only screen and (max-width: 768px) {
  /deep/ .p-toolbar-group-left,
  /deep/ .p-toolbar-group-right {
    display: flex;
    flex-direction: column;
    width: 100%
  }

  .p-overlaypanel {
    margin-left: -10%;
    width: 70%;
  }

  /deep/ .p-toolbar-group-left button,
  /deep/ .p-toolbar-group-right button {
    width: 100%;
    margin-bottom: 0.2rem;
  }

  /deep/ .p-toolbar-group-left button:first-of-type,
  /deep/ .p-toolbar-group-right button:first-of-type {
    width: 100%;
    margin-right: 0rem;
  }
}

</style>
