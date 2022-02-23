<template>
  <lck-overlaypanel
    icon="pi pi-filter"
    class-button="p-button-outlined p-button-secondary"
    :disabled="disabled"
    :label="$tc('components.datatable.toolbar.filters.label', value.length)"
    appendTo="body"
  >
    <template #overlay-content="overlaySlotProps">
      <p-button
        class="p-button-text p-button-rounded save-filter-button"
        :disabled="!canSaveFilters"
        :icon="`pi ${ value.length === 0 || hasChanged ? 'pi-star-o' : 'pi-star'}`"
        @click="saveFilters"
      />
      <div
        class="p-mb-2 filters-listing"
        v-if="value.length > 0"
      >
        <div
          class="p-formgroup-inline p-mb-1"
          v-for="(filter, index) in value"
          :key="`filter-${index}`"
        >
          <div
            :class="`p-col-fixed p-p-0 p-mr-2 ${index === 0 ? 'p-as-end' : 'p-as-center'}`"
            :style="{
              width: '2rem'
            }"
          >
            <p-button
              v-show="value.length > 1"
              icon="bi bi-trash"
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
          <div class="p-col-3 p-p-0 p-mr-2">
            <label for="column" v-if="index === 0">
              {{ $t('components.datatable.toolbar.filters.form.column') }}
            </label>
            <p-dropdown
              id="column"
              :options="supportedColumns"
              dataKey="value"
              optionLabel="label"
              :placeholder="$t('components.datatable.toolbar.filters.form.placeholder')"
              @change="onChangeColumn(index)"
              v-model="filter.column"
            />
          </div>
          <div class="p-col-3 p-p-0 p-mr-2">
            <label for="action" v-if="index === 0">
              {{ $t('components.datatable.toolbar.filters.form.action') }}
            </label>
            <p-dropdown
              id="action"
              type="text"
              :options="filter.column && columnFiltersConfig[filter.column.originalType].actions || []"
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
            class="p-col-3 p-p-0"
            v-if="filter.action && filter.action.predefinedPattern === undefined"
          >
            <label for="pattern" v-if="index === 0">
              {{ $t('components.datatable.toolbar.filters.form.pattern') }}
            </label>
            <component
              id="pattern"
              v-if="
                columnFiltersConfig[filter.column.originalType].patternComponent ||
                getComponentEditorCellForColumnType(filter.column.originalType)
              "
              :is="
                columnFiltersConfig[filter.column.originalType].patternComponent ||
                getComponentEditorCellForColumnType(filter.column.originalType)
              "
              :options="columnsDropdownOptions[filter.column.value]"
              v-bind="columnFiltersConfig[filter.column.originalType].patternComponentOptions || {}"
              v-model="filter.pattern"
            />
            <p-input-text
              id="pattern"
              v-else
              v-model="filter.pattern"
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
          icon="bi bi-plus-circle"
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
        <span class="p-ml-auto">
          <p-button
            class="p-button-primary"
            type="button"
            icon="pi pi-check-circle"
            :label="$t('form.submit')"
            @click="submitFilters(overlaySlotProps)"
            :disabled="value.length === 0 || invalidFilters"
          />
        </span>
      </div>
    </template>
  </lck-overlaypanel>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import OverlayPanel from '@/components/ui/OverlayPanel/OverlayPanel.vue'

import { COLUMN_TYPE } from '@locokit/lck-glossary/src'
import { getComponentEditorCellForColumnType, getColumnTypeId } from '@/services/lck-utils/columns'
import { LckTableViewColumn } from '@/services/lck-api/definitions'
import { Filter, FilterAction, OPERATORS, COLUMN_FILTERS_CONFIG } from '@/services/lck-utils/filter'

export default {
  name: 'LckFilterButton',
  components: {
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-input-number': Vue.extend(InputNumber),
    'p-calendar': Vue.extend(Calendar),
    'p-button': Vue.extend(Button),
    'lck-multiselect': MultiSelect,
    'lck-overlaypanel': Vue.extend(OverlayPanel),
  },
  props: {
    definition: {
      type: Object,
      required: false,
      default: () => ({
        columns: [],
      }),
    } as PropOptions<{
      columns: LckTableViewColumn[];
    }>,
    columnsDropdownOptions: {
      type: Object,
      required: false,
      default: () => ({}),
    } as PropOptions<Record<string, {
        value: string;
        label: string;
      }>>,
    value: {
      type: Array,
      required: false,
      default: () => ([]),
    } as PropOptions<Filter[]>,
    disabled: {
      type: Boolean,
      default: false,
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      columnFiltersConfig: COLUMN_FILTERS_CONFIG,
      operators: OPERATORS,
      selectedOperator: OPERATORS[0].value,
      hasChanged: false,
    }
  },
  computed: {
    supportedColumns () {
      if (!this.definition?.columns?.length) return []
      return this.definition.columns.reduce((acc, column) => {
        const originalType = getColumnTypeId(column)
        if (column.column_type_id !== COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN && COLUMN_FILTERS_CONFIG[originalType]) {
          acc.push({
            value: column.id,
            label: column.text,
            type: column.column_type_id,
            originalType,
          })
          /**
           * So, the user could filter unsupported types if the user create a LUC on a unsupported field.
           * That's a nice feature :-) (joke !)
           * TODO https://gitlab.makina-corpus.net/lck/lck-front/-/issues/406
           */
        } else if (column.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
          acc.push({
            value: column.id,
            label: column.text,
            type: COLUMN_TYPE.LOOKED_UP_COLUMN,
            originalType: COLUMN_TYPE.LOOKED_UP_COLUMN,
          })
        }
        return acc
      }, [] as {
        value: string;
        label: string;
        type: COLUMN_TYPE;
        originalType: COLUMN_TYPE;
      }[])
    },
    invalidFilters (): boolean {
      return this.value.some(
        ({ column, action, pattern }) => (column === null) || (action === null) || (pattern === null),
      )
    },
    canSaveFilters (): boolean {
      return !this.locked && !this.invalidFilters && (this.value.length > 0 || this.hasChanged)
    },
  },
  methods: {
    getComponentEditorCellForColumnType,
    removeFilter (filterToRemove: Filter) {
      this.$emit('input', this.value.filter(f => (f !== filterToRemove)))
    },
    resetFilters () {
      this.$emit('reset')
    },
    submitFilters (overlaySlotProps: { toggleOverlayPanel: Function }) {
      this.$emit('submit')
      overlaySlotProps.toggleOverlayPanel()
    },
    saveFilters () {
      this.$emit('save-filters', this.hasChanged)
      this.hasChanged = !this.hasChanged
    },
    addFilter () {
      this.value.push({
        operator: this.selectedOperator,
        column: null,
        action: null,
        pattern: null,
      })
    },
    onChangeOperator (event: { value: string }) {
      this.selectedOperator = event.value
      if (this.value.length > 1) {
        this.value.forEach(filter => (filter.operator = this.selectedOperator))
      }
    },
    onChangeColumn (index: number) {
      this.value[index].action = null
      this.value[index].pattern = null
    },
    actionControlPattern (index: number, { value }: { value: FilterAction }) {
      if (value?.predefinedPattern !== undefined) {
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
    },
  },
  watch: {
    value: {
      deep: true,
      handler () {
        if (!this.hasChanged) this.hasChanged = true
      },
    },
    definition () {
      if (this.hasChanged) this.hasChanged = false
    },
  },
}
</script>

<style scoped>

label {
  display: block;
  font-size: var(--font-size-sm);
}

input,
.p-inputwrapper {
  font-size: var(--font-size-md);
  max-width: 100%;
  width: 100%;
  line-height: normal;
}

::v-deep .p-overlaypanel {
  max-width: 100%;
}

::v-deep .p-dropdown-label.p-inputtext {
  font-size: var(--font-size-md);
  line-height: normal;
}

::v-deep .p-button {
  width: auto;
}

.filters-listing {
  width: 700px;
  max-width: 100%;
}

.save-filter-button {
  position: absolute;
  top: 0;
  right: 0.5rem;
}

</style>
