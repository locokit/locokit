<template>
  <div
    :class="{
      'mb-4': !f.hidden,
    }"
  >
    <FormField
      v-slot="$field"
      :name="f.id"
      :initialValue="f.defaultValue"
      class="flex flex-col gap-1"
    >
      <!-- boolean -->
      <div class="flex items-center" v-if="!f.hidden">
        <PrimeToggleSwitch
          v-if="f.component === FIELD_COMPONENT.TOGGLE_SWITCH"
          :name="f.id"
          :id="f.id"
          class="mr-2"
          :class="f.class"
          fluid
          :model-value="states[f.id]?.value"
        />

        <label :for="f.id">
          {{ f.label }}
          <span v-if="f.validationRules?.required" class="text-red-500">*</span>
        </label>
      </div>

      <!-- Read only fields -->
      <PrimeInputText
        v-if="f.readonly"
        :name="f.id"
        :class="f.class"
        :id="f.id"
        type="text"
        :value="f.displayValue"
        disabled
        fluid
      />

      <PrimeInputText
        v-else-if="f.hidden"
        :name="f.id"
        :class="f.class"
        :id="f.id"
        type="hidden"
        fluid
      />

      <!-- text / email -->
      <PrimeInputText
        v-else-if="f.component === FIELD_COMPONENT.INPUT_TEXT"
        :name="f.id"
        :class="f.class"
        :id="f.id"
        type="text"
        fluid
      />
      <PrimeInputText
        v-else-if="f.component === FIELD_COMPONENT.INPUT_EMAIL"
        :name="f.id"
        :id="f.id"
        :class="f.class"
        type="email"
        fluid
      />

      <!-- password -->
      <PrimePassword
        v-else-if="f.component === FIELD_COMPONENT.INPUT_PASSWORD"
        :name="f.id"
        :input-id="f.id"
        :class="f.class"
        :feedback="false"
        toggleMask
        fluid
      />

      <!-- number / float -->
      <PrimeInputNumber
        v-else-if="f.component === FIELD_COMPONENT.INPUT_NUMBER"
        :name="f.id"
        :class="f.class"
        :input-id="f.id"
        fluid
        v-bind="
          typeof f.settings?.default?.attrs === 'function'
            ? f.settings?.default?.attrs($field, states, props.relatedRecords, formRef!)
            : f.settings?.default?.attrs || {}
        "
      />
      <PrimeInputNumber
        v-else-if="f.component === FIELD_COMPONENT.INPUT_FLOAT"
        :name="f.id"
        :class="f.class"
        :input-id="f.id"
        fluid
        v-bind="
          typeof f.settings?.default?.attrs === 'function'
            ? f.settings?.default?.attrs($field, states, props.relatedRecords, formRef!)
            : f.settings?.default?.attrs || {}
        "
        mode="decimal"
      />

      <!-- date / datetime -->
      <PrimeInputText
        v-else-if="
          f.component === FIELD_COMPONENT.INPUT_DATE ||
          f.component === FIELD_COMPONENT.INPUT_DATETIME
        "
        :name="f.id"
        :class="f.class"
        :id="f.id"
        :type="f.component === FIELD_COMPONENT.INPUT_DATE ? 'date' : 'datetime-local'"
        :show-time="f.component === FIELD_COMPONENT.INPUT_DATETIME"
        show-icon
        icon-display="input"
        append-to="body"
        fluid
      />

      <!-- single select -->
      <PrimeSelect
        v-else-if="f.component === FIELD_COMPONENT.SINGLE_SELECT"
        :name="f.id"
        :class="f.class"
        :label-id="f.id"
        :options="(f as LocoKitFormFieldSingleSelect).source.options"
        :show-clear="true"
        :placeholder="t('locokit.components.primeDropdown.placeholder')"
        class="mb-2 w-full"
        fluid
      >
        <template #value="slotProps">
          <single-tag
            v-if="slotProps.value"
            :label="getSelectOptionLabel(slotProps.value, f as LocoKitFormFieldSingleSelect)"
            :color="getSelectOptionColors(slotProps.value, f as LocoKitFormFieldSingleSelect)?.text"
            :background-color="
              getSelectOptionColors(slotProps.value, f as LocoKitFormFieldSingleSelect)?.background
            "
          />
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <single-tag
            :label="getSelectOptionLabel(slotProps.option, f as LocoKitFormFieldSingleSelect)"
            :color="
              getSelectOptionColors(slotProps.option, f as LocoKitFormFieldSingleSelect)?.text
            "
            :background-color="
              getSelectOptionColors(slotProps.option, f as LocoKitFormFieldSingleSelect)?.background
            "
          />
        </template>
      </PrimeSelect>

      <!-- autocomplete -->
      <PrimeAutocomplete
        v-else-if="f.component === FIELD_COMPONENT.AUTOCOMPLETE"
        :name="f.id"
        :class="f.class"
        :input-id="f.id"
        :placeholder="t('locokit.components.primeAutocomplete.placeholder')"
        :suggestions="props.autocompleteSuggestions"
        :option-label="(f as LocoKitFormFieldAutocomplete).source.label"
        :force-selection="!((f as LocoKitFormFieldAutocomplete).freeInput ?? true)"
        @complete="onComplete($event, f as LocoKitFormFieldAutocomplete)"
        @value-change="(value) => onValueChange(value, f as LocoKitFormFieldAutocomplete)"
        input-class="w-full border-r-0 hover:border-surface-500 "
        dropdown
        dropdown-mode="current"
        dropdown-class="bg-transparent hover:bg-transparent primary border-l-0 border-surface-300 text-surface-500 hover:border-surface-500 w-12"
        fluid
      />

      <!-- textarea -->
      <PrimeTextarea
        v-else-if="f.component === FIELD_COMPONENT.TEXTAREA"
        :name="f.id"
        :class="f.class"
        :id="f.id"
        :rows="(f as LocoKitFormFieldTextarea).rows ?? 6"
        :cols="(f as LocoKitFormFieldTextarea).cols"
        :fluid="!(f as LocoKitFormFieldTextarea).cols"
      />

      <template v-else-if="f.component === 'SPECIFIC_COMPONENT'">
        <!-- v-model="$field.value" -->
        <component
          :id="f.id"
          :is="f.specificComponent"
          :class="f.class"
          v-bind="
            typeof f.settings?.default?.attrs === 'function'
              ? f.settings.default.attrs($field, states, props.relatedRecords, formRef!)
              : f.settings?.default?.attrs
          "
        />
      </template>

      <PrimeMessage v-else-if="f.component !== FIELD_COMPONENT.TOGGLE_SWITCH" severity="error">
        Component {{ f.component }} is not yet implemented.
      </PrimeMessage>
    </FormField>
    <template v-if="f.description">
      <p class="text-slate-500 text-sm" v-for="(line, index) in f.description" :key="index">
        {{ line }}
      </p>
    </template>

    <PrimeMessage
      v-if="states?.[f.id]?.invalid"
      severity="error"
      size="small"
      variant="simple"
      :data-testid="'field-error-' + f.id"
    >
      {{ states?.[f.id]?.error?.message }}
    </PrimeMessage>
  </div>
</template>

<script setup lang="ts">
import { FIELD_COMPONENT } from '@locokit/shared'
import type {
  LocoKitFormFieldSingleSelect,
  LocoKitFormFieldAutocomplete,
  LocoKitFormFieldTextarea,
  LocoKitTableRecordEnhanced,
  LocoKitFormField,
} from '@locokit/shared'
import type { FormFieldState, FormInstance } from '@primevue/forms'
import { inject, ref, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { FormField } from '@primevue/forms'

/** PrimeVue components */
import PrimeAutocomplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import PrimeInputNumber from 'primevue/inputnumber'
import PrimeInputText from 'primevue/inputtext'
import PrimeMessage from 'primevue/message'
import PrimePassword from 'primevue/password'
import PrimeSelect from 'primevue/select'
import PrimeTextarea from 'primevue/textarea'
import PrimeToggleSwitch from 'primevue/toggleswitch'
import SingleTag from '@/components/ui/single-tag/single-tag.vue'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    fields: LocoKitFormField[]
    f: LocoKitFormField
    states: {
      [key: string]: FormFieldState
    }
    /**
     * Suggestions used for autocomplete fields.
     * Only one prop is used,
     * and passed to all autocomplete fields,
     * as only one can be edited at a time.
     */
    autocompleteSuggestions?: unknown[]
    /**
     * Related records for filtering purpose
     */
    relatedRecords?: Record<string, LocoKitTableRecordEnhanced[]>
    /**
     * Index of the field in the array, if in an array
     */
    arrayIdx?: number
    /**
     *
     */
  }>(),
  {
    fields: () => [],
    autocompleteSuggestions: () => [],
    relatedRecords: () => ({}),
    arrayIdx: 0,
  },
)
const formRef = inject<FormInstance>('formRef')
const emit = defineEmits<{
  complete: [event: AutoCompleteCompleteEvent, field: LocoKitFormFieldAutocomplete]
}>()

function getSelectOptionLabel(
  option: Record<number | string, string> | string,
  field: LocoKitFormFieldSingleSelect,
): string {
  if (typeof option === 'object' && field.source.label) {
    return option[field.source.label]
  }

  return option as string
}

function getSelectOptionColors(
  option: Record<string, string>,
  field: LocoKitFormFieldSingleSelect,
): { text?: string; background?: string } | undefined {
  if (typeof option === 'object' && field.source.colorFields) {
    const colorFields = field.source.colorFields
    return {
      text: colorFields.text ? option[colorFields.text] : undefined,
      background: colorFields.background ? option[colorFields.background] : undefined,
    }
  }

  return undefined
}

function onValueChange(value: unknown, field: LocoKitFormFieldAutocomplete) {
  // If the value is an object, this means it matches a suggestion
  // which is represented by an object.
  if (value && typeof value === 'object') {
    autocompleteSelectedOptions.value[field.id] = toValue(value)
  } else if (field.id in autocompleteSelectedOptions.value) {
    delete autocompleteSelectedOptions.value[field.id]
  }
}

function onComplete(event: AutoCompleteCompleteEvent, field: LocoKitFormFieldAutocomplete) {
  emit('complete', event, field)
}
const autocompleteSelectedOptions = ref<Record<string, unknown>>({})
</script>
