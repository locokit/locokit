<template>
  <!--
    The actual slot of the PrimeForm is the states property...
    TODO: fix it when PrimeVue will fix this bug
    => typing is false for the template
  -->
  <PrimeForm
    v-slot="states"
    :resolver
    @submit="onFormSubmit"
    :initial-values
    validate-on-blur
    :validate-on-value-update="false"
  >
    <slot name="top" />
    <slot>
      <div class="flex flex-col gap-1">
        <template v-for="f in fieldsDisplayed(states).value" :key="f.id">
          <div class="mb-4">
            <!-- boolean -->
            <div class="flex items-center">
              <PrimeToggleSwitch
                v-if="f.component === FIELD_COMPONENT.TOGGLE_SWITCH"
                :name="f.id"
                class="mr-2"
                :class="f.class"
                fluid
              />

              <label :for="f.id">
                {{ f.label }}
                <span v-if="f.validationRules?.required" class="text-red-500">*</span>
              </label>
            </div>

            <!-- text / email -->
            <PrimeInputText
              v-if="f.component === FIELD_COMPONENT.INPUT_TEXT"
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
            />

            <!-- date / datetime -->
            <PrimeInputText
              v-else-if="
                [FIELD_COMPONENT.INPUT_DATE, FIELD_COMPONENT.INPUT_DATETIME].includes(f.component)
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
              :options="f.source.options"
              :show-clear="true"
              :placeholder="t('locokit.components.primeDropdown.placeholder')"
              class="mb-2 w-full"
              fluid
            >
              <template #value="slotProps">
                <single-tag
                  v-if="slotProps.value"
                  :label="getSelectOptionLabel(slotProps.value, f)"
                  :color="getSelectOptionColors(slotProps.value, f)?.text"
                  :background-color="getSelectOptionColors(slotProps.value, f)?.background"
                />
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <single-tag
                  :label="getSelectOptionLabel(slotProps.option, f)"
                  :color="getSelectOptionColors(slotProps.option, f)?.text"
                  :background-color="getSelectOptionColors(slotProps.option, f)?.background"
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
              :option-label="f.source.label"
              :force-selection="!(f.freeInput ?? true)"
              @complete="onComplete($event, f, states)"
              @value-change="(value) => onValueChange(value, f)"
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
              :rows="f.rows ?? 6"
              :cols="f.cols"
              :fluid="!f.cols"
            />

            <PrimeMessage
              v-else-if="f.component !== FIELD_COMPONENT.TOGGLE_SWITCH"
              severity="error"
            >
              Component {{ f.component }} is not yet implemented.
            </PrimeMessage>

            <template v-if="f.description">
              <p class="text-slate-500" v-for="(line, index) in f.description" :key="index">
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
      </div>
    </slot>

    <slot name="bottom" />

    <PrimeMessage
      v-if="message"
      :severity="message.status"
      class="my-2"
      data-testid="form-generic-message"
    >
      {{ message.text }}
    </PrimeMessage>

    <slot name="buttons">
      <div
        class="flex items-center justify-center gap-2 drop-shadow-lg"
        :class="{
          'sticky bottom-0': props.buttonPosition === 'sticky',
        }"
      >
        <PrimeButton
          v-if="buttons.submit"
          type="submit"
          severity="primary"
          :disabled="loading"
          :label="buttonLabels.submit"
          :icon="loading ? 'pi pi-spin pi-spinner' : 'bi bi-floppy'"
        />
        <PrimeButton v-if="buttons.cancel" severity="secondary" :label="buttonLabels.cancel" />
        <PrimeButton v-if="buttons.reset" type="reset" :label="buttonLabels.reset" />
      </div>
    </slot>
  </PrimeForm>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// correlated to PrimeVue forms "states" / v-slot
import { computed, onMounted, ref, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  FormFieldState,
  FormResolverOptions,
  FormSubmitEvent,
  Form as PrimeForm,
} from '@primevue/forms'
import PrimeAutocomplete, { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import PrimeButton from 'primevue/button'
import PrimeDatePicker from 'primevue/datepicker'
import PrimeInputNumber from 'primevue/inputnumber'
import PrimeInputText from 'primevue/inputtext'
import PrimeMessage from 'primevue/message'
import PrimePassword from 'primevue/password'
import PrimeSelect from 'primevue/select'
import PrimeTextarea from 'primevue/textarea'
import PrimeToggleSwitch from 'primevue/toggleswitch'
import {
  FIELD_COMPONENT,
  type LocoKitFormField,
  type LocoKitFormFieldAutocomplete,
  type LocoKitFormFieldSingleSelect,
  type LocoKitMessage,
} from '@locokit/definitions'
import SingleTag from '../../ui/single-tag/single-tag.vue'

const { t } = useI18n()

const emit = defineEmits<{
  submit: [values: Record<string, unknown>]
  complete: [
    event: AutoCompleteCompleteEvent,
    field: LocoKitFormFieldAutocomplete,
    values: Record<string, unknown>
  ]
}>()

const props = withDefaults(
  defineProps<{
    fields: LocoKitFormField[]
    initialValues?: Record<string, string | number | boolean | Object | null>
    loading?: boolean
    buttons?: {
      submit: boolean
      reset: boolean
      cancel: boolean
    }
    labels?: {
      submit?: string
      reset?: string
      cancel?: string
    }
    /** How to display submit buttons, default to sticky */
    buttonPosition?: 'sticky' | 'block'
    /** A message to display into the form, just above the buttons. */
    message?: LocoKitMessage
    /**
     * Suggestions used for autocomplete fields.
     * Only one prop is used,
     * and passed to all autocomplete fields,
     * as only one can be edited at a time.
     */
    autocompleteSuggestions?: unknown[]
  }>(),
  {
    fields: () => [],
    initialValues: () => ({}),
    loading: false,
    buttons: () => ({
      submit: true,
      reset: false,
      cancel: true,
    }),
    buttonPosition: 'sticky',
    labels: () => ({}),
    autocompleteSuggestions: () => [],
  },
)

const autocompleteSelectedOptions = ref<Record<string, unknown>>({})

const buttonLabels = computed(() => {
  return {
    submit: props.labels.submit ?? t('locokit.components.formGeneric.submit'),
    reset: props.labels.reset ?? t('locokit.components.formGeneric.reset'),
    cancel: props.labels.cancel ?? t('locokit.components.formGeneric.cancel'),
  }
})

const fieldsDisplayed = (state: Record<string, FormFieldState>) => {
  return computed(() => {
    const result: LocoKitFormField[] = []
    function getFieldDescription(f: LocoKitFormField) {
      if (!f.description) return null
      return Array.isArray(f.description) ? f.description : [f.description]
    }
    props.fields.forEach((f) => {
      let isDisplayed = true
      if (f.conditionalDisplay?.enabled) {
        f.conditionalDisplay.rules.forEach((rule) => {
          const foreignFieldValue = state[rule.fieldId].value
          switch (rule.operator) {
            case '$eq':
              isDisplayed = isDisplayed && foreignFieldValue === rule.value
              break
            case '$in':
              isDisplayed = isDisplayed && (rule.value as unknown[]).includes(foreignFieldValue)
              break
            default:
              console.warn('Operator for conditional display not yet implemented: ' + rule.operator)
          }
        })
      }
      if (isDisplayed)
        result.push({
          ...f,
          description: getFieldDescription(f),
        })
    })

    return result
  })
}

onMounted(() => {
  // Initialize autocompleteSelectedOptions variable with initial values
  // of autocomplete fields.
  for (const key in props.initialValues) {
    // Find the field definition matching the current initial value.
    const field = props.fields.find((item) => item.id === key)
    // Skip if the value does not concern any field.
    if (!field) {
      continue
    }

    if (field.component === FIELD_COMPONENT.AUTOCOMPLETE) {
      const value = props.initialValues[key]
      if (typeof value === 'object') {
        autocompleteSelectedOptions.value[field.id] = toValue(value)
      }
    }
  }
})

function getSelectOptionLabel(option: unknown, field: LocoKitFormFieldSingleSelect) {
  if (typeof option === 'object' && field.source.label) {
    return option[field.source.label]
  }

  return option
}

function getSelectOptionValue(option: unknown, field: LocoKitFormFieldSingleSelect) {
  if (typeof option === 'object' && field.source.value) {
    return option[field.source.value]
  }

  return option
}

function getSelectOptionColors(option: unknown, field: LocoKitFormFieldSingleSelect) {
  if (typeof option === 'object' && field.source.colorFields) {
    const colorFields = field.source.colorFields
    return {
      text: colorFields.text ? option[colorFields.text] : null,
      background: colorFields.background ? option[colorFields.background] : null,
    }
  }

  return null
}

const resolver = ({ values }: FormResolverOptions) => {
  const errors: Record<string, { message: string }[]> = {}

  props.fields.forEach((f) => {
    errors[f.id] = []
    if (f.validationRules?.required) {
      if (!values[f.id]) {
        errors[f.id].push({
          message: t('locokit.validations.messages.required', { field: f.label }),
        })
      }
    }
  })

  return {
    errors,
  }
}

function extractValuesFromStates(states: Record<string, unknown>) {
  const values = {}

  for (const key in states) {
    // Ignore states which are not objects or do not have a "value" property.
    if (typeof states[key] !== 'object' || !('value' in states[key])) {
      continue
    }

    // Find the field definition matching the current state.
    const field = props.fields.find((item) => item.id === key)
    // No need to continue if the state does not concern one of our fields.
    if (!field) {
      continue
    }

    // Special handling of autocomplete fields whose suggestions can be objects
    // and not just strings.
    if (
      field.component === FIELD_COMPONENT.AUTOCOMPLETE &&
      field.id in autocompleteSelectedOptions.value
    ) {
      const option = autocompleteSelectedOptions.value[field.id]
      const valueProp = (field as LocoKitFormFieldAutocomplete).source.value
      values[field.id] = valueProp ? option[valueProp] : option

      continue
    }

    // Special handling of single select fields whose suggestions can be objects
    // and not just strings or numbers.
    if (field.component === FIELD_COMPONENT.SINGLE_SELECT) {
      values[field.id] = getSelectOptionValue(states[field.id].value, field)

      continue
    }

    values[field.id] = states[field.id].value
  }

  return values
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

function onComplete(
  event: AutoCompleteCompleteEvent,
  field: LocoKitFormFieldAutocomplete,
  formState: Record<string, unknown>,
) {
  const values = extractValuesFromStates(formState)
  emit('complete', event, field, values)
}

function onFormSubmit({ valid, states }: FormSubmitEvent) {
  if (valid) {
    const values = extractValuesFromStates(states)
    emit('submit', values)
  }
}
</script>
