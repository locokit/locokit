<template>
  <PrimeButton class="w-full p-button-outlined" @click="togglePopover">
    <div class="relative flex w-full">
      <i class="bi bi-funnel-fill" />
      <p class="pl-1 flex w-full">
        {{ $t('locokit.components.filterBuilder.label', nbActiveFilters) }}
      </p>
    </div>
  </PrimeButton>
  <PrimePopover
    id="filter-overlay-panel"
    ref="popoverRef"
    class="ml-1 min-w-[52em]"
    :append-to="appendTo"
  >
    <div class="flex">
      <div class="max-h-48 overflow-y-scroll m-1 w-full">
        <div
          v-for="({ filter, rules, component, properties }, index) in computedFilters"
          :key="`filter-${index}`"
          class="flex flex-row gap-1 items-end mt-0.5"
        >
          <div class="w-4 self-center">
            <PrimeButton
              v-if="index > 0"
              class="p-button-outlined p-button-text p-button-danger !w-4 h-4"
              icon="bi bi-x"
              :disabled="filters.length === 1"
              @click.stop="removeFilter(index)"
            />
          </div>

          <div class="w-20">
            <PrimeSelect
              v-if="index > 0"
              v-model="currentOperator"
              :disabled="index > 1"
              class="w-full"
              input-class="!text-xs !px-1 text-center"
              panel-class="!text-xs"
              :options="LOGICAL_OPERATORS"
              option-label="label"
              option-value="operator"
              @change="onChangeOperator"
            >
              <template #value="slotProps">
                <span>
                  {{ $t(`locokit.components.filterBuilder.select.operator.${slotProps.value}`) }}
                </span>
              </template>
              <template #option="slotProps">
                <span>
                  {{ $t(`locokit.components.filterBuilder.select.operator.${slotProps.option.operator}`) }}
                </span>
              </template>
            </PrimeSelect>
          </div>
          <div class="w-1/4">
            <label v-if="index === 0" class="text-xs" :for="`field-${index}`">
              {{ $t('locokit.components.filterBuilder.field') }}
            </label>
            <PrimeSelect
              v-model="filter.field"
              :label-id="`field-${index}`"
              class="w-full"
              input-class="!text-xs"
              panel-class="!text-xs"
              :options="fieldsDefinition"
              data-key="name"
              option-label="name"
              :aria-label="$t(
                'locokit.components.filterBuilder.fieldAriaLabel',
                { number: index + 1 }
              )"
              :pt="{
                list: {
                  ariaLabel: 'Fields list',
                }
              }"
              @change="onChangeField(index)"
            />
          </div>
          <div class="w-1/4">
            <label v-if="index === 0" class="text-xs" :for="`rule-${index}`">
              {{ $t('locokit.components.filterBuilder.rule') }}
            </label>
            <PrimeSelect
              v-model="filter.rule"
              :label-id="`rule-${index}`"
              class="w-full"
              input-class="!text-xs"
              panel-class="!text-xs"
              :disabled="!filter.field"
              :options="rules || []"
              :option-label="getOptionLabel"
              :aria-label="$t(
                'locokit.components.filterBuilder.ruleAriaLabel',
                { number: index + 1 }
              )"
              :pt="{
                list: {
                  ariaLabel: 'Rules list',
                }
              }"
              @change="onChangeRule(index, $event)"
            >
              <template #value="slotProps">
                <span v-if="slotProps.value">
                  {{ $t(`locokit.components.filterBuilder.select.rule.${slotProps.value.label}`) }}
                </span>
              </template>
              <template #option="slotProps">
                <span>
                  {{ $t(`locokit.components.filterBuilder.select.rule.${slotProps.option.label}`) }}
                </span>
              </template>
            </PrimeSelect>
          </div>
          <div
            v-if="
              filter.field &&
              filter.rule?.predefinedValue === undefined &&
              component
            "
            class="w-1/4"
          >
            <label v-if="index === 0" class="text-xs" for="value-0">
              {{ $t('locokit.components.filterBuilder.value') }}
            </label>
            <component
              :is="component"
              v-bind="properties"
              v-model="filter.value"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between mt-4">
      <div class="flex gap-2">
        <PrimeButton
          class="p-button-outlined p-button-secondary p-button-rounded"
          @click="addFilter"
        >
          <i class="bi bi-plus text-primary mr-1" />
          <p class="text-primary font-semibold">
            {{ $t('locokit.components.filterBuilder.addFilter') }}
          </p>
        </PrimeButton>
        <PrimeButton
          class="p-button-outlined p-button-secondary p-button-rounded"
          @click="resetFilters"
        >
          <i class="bi bi-arrow-counterclockwise text-primary mr-1" />
          <p class="text-primary font-semibold">
            {{ $t('locokit.components.filterBuilder.reset') }}
          </p>
        </PrimeButton>
      </div>
      <PrimeButton
        class="p-button-secondary p-button-rounded font-semibold"
        icon="bi-check-lg"
        :label="$t('locokit.components.filterBuilder.submit')"
        @click="onClickFilters"
      />
    </div>
  </PrimePopover>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import PrimeButton from 'primevue/button'
import PrimePopover from 'primevue/popover'
import PrimeSelect from 'primevue/select'
import {
  LOGICAL_OPERATORS,
  getFilteringParamsFor,
  type Filter,
  type FilterRule,
} from '@/helpers/filter'
import type { Popover } from '@/types/prime.d'
import InputNumber from 'primevue/inputnumber'

const { t } = useI18n()

const emit = defineEmits<{
  'submit-filters': [filters: Filter[]]
  'reset-filters': []
}>()

const props = withDefaults(
  defineProps<{
    appendTo?: string
    currentFilters?: Filter[]
    // For input that need data (e.g. option in dropdown),
    // can possibly override default config,
    // Key = Field slug
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldOptions?: Record<string, any>
    fieldsDefinition: Array<{
      slug: string
      name: string
      type: string
    }>
  }>(),
  {
    appendTo: 'body',
    currentFilters: () => [],
    fieldOptions: () => ({}),
  },
)

const popoverRef = ref<Popover | null>(null)
const filters = ref<Filter[]>([])
const currentOperator = ref(LOGICAL_OPERATORS[0].operator)
const nbActiveFilters = ref<number>(0)

type FilterIterationItem = {
  filter: Filter
  rules?: FilterRule[]
  component?: Component
  properties?: { [key: string]: unknown }
}

const computedFilters = computed((): FilterIterationItem[] => {
  return filters.value.map((filter, index): FilterIterationItem => {
    if (!filter.field) {
      return { filter }
    }

    const filteringParams = getFilteringParamsFor(filter.field.type)
    const rules = filteringParams.rules
    const component = filteringParams.valueComponent

    if (!component) {
      return { filter, rules }
    }

    // Compute component properties.
    let idPropName = 'id'
    switch (component.name) {
      case InputNumber.name:
        idPropName = 'inputId'
    }

    const properties = {
      ...(filteringParams.valueComponentProps || {}),
      ...props.fieldOptions[filter.field.slug],
      ariaLabel: t(
        'locokit.components.filterBuilder.valueAriaLabel',
        { number: index + 1 }
      ),
      [idPropName]: `value-${index}`,
    }

    return { filter, rules, component, properties }
  })
})

const togglePopover = (event: Event) => {
  popoverRef.value?.toggle(event)
}

const getOptionLabel = (opt: FilterRule): string => {
  return t(`locokit.components.filterBuilder.select.rule.${opt.label}`)
}

const addFilter = () => {
  filters.value.push({
    field: null,
    rule: null,
    value: null,
    logicalOperator: currentOperator.value,
  })
}

const onChangeOperator = (event: { value: string }) => {
  currentOperator.value = event.value
  if (filters.value.length > 1) {
    filters.value.forEach((filter) => (filter.logicalOperator = event.value))
  }
}

const onChangeField = (index: number) => {
  filters.value[index].rule = null
  filters.value[index].value = null
}

const onChangeRule = (index: number, { value }: { value: FilterRule }) => {
  if (value?.predefinedValue !== undefined) {
    // Set the pattern if the selected rule has a predefined one
    filters.value[index].value = value.predefinedValue
  } else {
    // Reset the pattern in case the previous rule had a predefined one
    filters.value[index].value = null
  }
  // Set the rule
  filters.value[index].rule = value
}

const onClickFilters = () => {
  if (filters.value[0].field) {
    nbActiveFilters.value = filters.value.length
  } else {
    nbActiveFilters.value = 0
  }
  emit('submit-filters', filters.value)
  popoverRef.value?.hide()
}

const resetFilters = () => {
  filters.value = []
  nbActiveFilters.value = 0
  addFilter()
  emit('reset-filters')
}

const removeFilter = (index: number) => {
  filters.value.splice(index, 1)
}

onMounted(async () => {
  if (props.currentFilters?.length > 0) {
    filters.value = props.currentFilters
    nbActiveFilters.value = props.currentFilters.length
  } else {
    nbActiveFilters.value = 0
    addFilter()
  }
})
</script>
