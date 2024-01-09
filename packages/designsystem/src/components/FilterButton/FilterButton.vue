<template>
  <PrimeButton class="w-full p-button-outlined" @click="togglePopover">
    <div class="relative flex w-full">
      <i class="bi bi-funnel-fill" />
      <p class="pl-1 flex w-full">
        {{ $t('components.filterButton.label', nbActiveFilters) }}
      </p>
    </div>
  </PrimeButton>
  <PrimeOverlayPanel
    id="filter_overlay_panel"
    ref="modalRef"
    class="ml-1 min-w-[52em]"
    :append-to="appendTo"
  >
    <div class="flex">
      <div class="max-h-48 overflow-y-scroll m-1 w-full">
        <div
          v-for="(filter, index) in filters"
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
            <PrimeDropdown
              v-if="index > 0"
              v-model="currentOperator"
              :disabled="index > 1"
              class="w-full"
              input-class="!text-xs !px-1 text-center"
              panel-class="!text-xs"
              :options="OPERATORS"
              option-label="label"
              option-value="featherKey"
              @change="onChangeOperator"
            >
              <template #value="slotProps">
                <span>
                  {{
                    $t(
                      `components.filterButton.select.operator.${slotProps.value}`,
                    )
                  }}
                </span>
              </template>
              <template #option="slotProps">
                <span>
                  {{
                    $t(
                      `components.filterButton.select.operator.${slotProps.option.featherKey}`,
                    )
                  }}
                </span>
              </template>
            </PrimeDropdown>
          </div>
          <div class="w-1/4">
            <label v-if="index === 0" class="text-xs" for="column">
              {{ $t('components.filterButton.column') }}
            </label>
            <PrimeDropdown
              id="column"
              v-model="filter.column"
              input-id="column"
              aria-label="column"
              aria-labelledby="column"
              class="w-full"
              input-class="!text-xs"
              panel-class="!text-xs"
              :options="columnsDefinition"
              data-key="name"
              option-label="name"
              @change="onChangeColumn(index)"
            />
          </div>
          <div class="w-1/4">
            <label v-if="index === 0" class="text-xs" for="action">
              {{ $t('components.filterButton.action') }}
            </label>
            <PrimeDropdown
              v-model="filter.action"
              input-id="action"
              class="w-full"
              input-class="!text-xs"
              panel-class="!text-xs"
              :disabled="!filter.column"
              :options="
                filter.column
                  ? FILTER_CONFIG_TO_MATCH_FIELD[filter?.column.type].actions
                  : []
              "
              option-label="label"
              @change="onChangeAction(index, $event)"
            >
              <template #value="slotProps">
                <span v-if="slotProps.value">
                  {{
                    $t(
                      `components.filterButton.select.action.${slotProps.value.label}`,
                    )
                  }}
                </span>
              </template>
              <template #option="slotProps">
                <span>
                  {{
                    $t(
                      `components.filterButton.select.action.${slotProps.option.label}`,
                    )
                  }}
                </span>
              </template>
            </PrimeDropdown>
          </div>
          <div
            v-if="
              filter.action &&
              filter.action.predefinedPattern === undefined &&
              FILTER_CONFIG_TO_MATCH_FIELD[filter.column.type]?.usedComponent
            "
            class="w-1/4 flex flex-col"
          >
            <label v-if="index === 0" class="text-xs" for="motif">
              {{ $t('components.filterButton.motif') }}
            </label>
            <component
              :is="
                FILTER_CONFIG_TO_MATCH_FIELD[filter.column.type].usedComponent
              "
              v-bind="
                {
                  ...(FILTER_CONFIG_TO_MATCH_FIELD[filter.column.type]
                    ?.patternComponentOptions || {}),
                  ...dataFromField[filter.column.slug],
                } || {}
              "
              v-model="filter.motif"
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
            {{ $t('components.filterButton.addFilter') }}
          </p>
        </PrimeButton>
        <PrimeButton
          class="p-button-outlined p-button-secondary p-button-rounded"
          @click="resetFilters"
        >
          <i class="bi bi-arrow-counterclockwise text-primary mr-1" />
          <p class="text-primary font-semibold">
            {{ $t('components.filterButton.reset') }}
          </p>
        </PrimeButton>
      </div>
      <PrimeButton
        class="p-button-secondary p-button-rounded font-semibold"
        icon="bi-check-lg"
        :label="$t('components.filterButton.submit')"
        @click="onClickFilters"
      />
    </div>
  </PrimeOverlayPanel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PrimeButton from 'primevue/button'
import PrimeDropdown from 'primevue/dropdown'
import PrimeOverlayPanel from 'primevue/overlaypanel'
import { FILTER_CONFIG_TO_MATCH_FIELD, OPERATORS } from '../../helpers/filter'
import type { Filter, FilterAction } from '../../helpers/filter'
import type { OverlayPanel } from '../../types/prime.d.'

const emit = defineEmits<{
  (e: 'submit-filters', filters: Filter[]): void
  (e: 'save-filters', filters: Filter[]): void
  (e: 'reset-filters'): void
}>()

const props = withDefaults(
  defineProps<{
    appendTo?: string
    currentFilters?: Filter[]
    // For input that need data (e.g. option in dropdown),
    // can possibly override default config,
    // Key = Field slug
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataFromField?: Record<string, any>
    columnsDefinition: Array<{
      slug: string
      name: string
      type: string
    }>
  }>(),
  {
    currentFilters: () => [],
    appendTo: 'body',
    dataFromField: () => ({}),
  },
)

const modalRef = ref<OverlayPanel | null>(null)
const filters = ref<Filter[]>([])
const currentOperator = ref(OPERATORS[0].featherKey)
const nbActiveFilters = ref<number | null>(null)

const togglePopover = (event: Event) => {
  modalRef.value?.toggle(event)
}

const addFilter = () => {
  filters.value.push({
    operator: currentOperator.value,
    column: null,
    action: null,
    motif: null,
  })
}

const onChangeOperator = (event: { value: string }) => {
  currentOperator.value = event.value
  if (filters.value.length > 1) {
    filters.value.forEach((filter) => (filter.operator = event.value))
  }
}

const onChangeColumn = (index: number) => {
  filters.value[index].action = null
  filters.value[index].motif = null
}

const onChangeAction = (index: number, { value }: { value: FilterAction }) => {
  if (value?.predefinedPattern !== undefined) {
    // Set the pattern if the selected action has a predefined one
    filters.value[index].motif = value.predefinedPattern
  } else {
    // Reset the pattern if the previous action had a predefined one
    filters.value[index].motif = null
  }
  // Set the action
  filters.value[index].action = value
}

const onClickFilters = () => {
  if (filters.value[0].column) {
    nbActiveFilters.value = filters.value.length
  } else {
    nbActiveFilters.value = 0
  }
  emit('submit-filters', filters.value)
  modalRef.value?.hide()
}

const resetFilters = () => {
  filters.value = []
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
