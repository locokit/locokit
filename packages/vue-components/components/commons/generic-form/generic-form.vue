<template>
  <PrimeForm
    v-slot="states"
    :resolver
    @submit="onFormSubmit"
    :initial-values
    validate-on-blur
    :validate-on-value-update="false"
    ref="formRef"
  >
    <slot name="top" />
    <slot>
      <div class="flex flex-col gap-1">
        <template v-for="f in fieldsDisplayed(states).value" :key="f.id">
          <div
            :class="{
              'mb-4': !f.hidden,
            }"
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
            />
            <PrimeInputNumber
              v-else-if="f.component === FIELD_COMPONENT.INPUT_FLOAT"
              :name="f.id"
              :class="f.class"
              :input-id="f.id"
              fluid
              mode="decimal"
              :minFractionDigits="2"
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
                  :color="
                    getSelectOptionColors(slotProps.value, f as LocoKitFormFieldSingleSelect)?.text
                  "
                  :background-color="
                    getSelectOptionColors(slotProps.value, f as LocoKitFormFieldSingleSelect)
                      ?.background
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
                    getSelectOptionColors(slotProps.option, f as LocoKitFormFieldSingleSelect)
                      ?.background
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
              @complete="onComplete($event, f as LocoKitFormFieldAutocomplete, states)"
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
              <FormField
                v-slot="$field"
                :name="f.id"
                :initialValue="f.defaultValue"
                class="flex flex-col gap-1"
              >
                <component
                  v-model="$field.value"
                  :id="f.id"
                  :is="f.specificComponent"
                  :class="f.class"
                  v-bind="
                    typeof f.attrs === 'function'
                      ? f.attrs($field, states, props.relatedRecords, formRef)
                      : f.attrs
                  "
                />
              </FormField>
            </template>

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
          v-if="buttons.submit?.enabled"
          type="submit"
          severity="primary"
          :disabled="loading"
          :label="buttons.submit?.label"
          :icon="loading ? buttons.submit?.loadingIcon : buttons.submit.icon"
          icon-pos="right"
        />
        <PrimeButton
          v-if="buttons.cancel?.enabled"
          severity="secondary"
          :label="buttons.cancel?.label"
          :disabled="loading"
          @click="emit('cancel')"
          :icon="buttons.cancel.icon"
        />
        <PrimeButton
          v-if="buttons.reset?.enabled"
          type="reset"
          :label="buttons.reset?.label"
          :disabled="loading"
          :icon="buttons.reset.icon"
        />
        <PrimeButton
          v-if="buttons.delete?.enabled"
          :icon="buttons.delete.icon"
          :disabled="loading"
          severity="danger"
          :label="buttons.delete?.label"
          @click="emit('delete')"
        />
      </div>
    </slot>
  </PrimeForm>
</template>

<script setup lang="ts">
// correlated to PrimeVue forms "states" / v-slot
import { computed, onMounted, ref, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  FormFieldState,
  FormResolverOptions,
  FormSubmitEvent,
  FormField,
  Form as PrimeForm,
} from '@primevue/forms'
import PrimeAutocomplete, { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import PrimeButton from 'primevue/button'
import PrimeInputNumber from 'primevue/inputnumber'
import PrimeInputText from 'primevue/inputtext'
import PrimeMessage from 'primevue/message'
import PrimePassword from 'primevue/password'
import PrimeSelect from 'primevue/select'
import PrimeTextarea from 'primevue/textarea'
import PrimeToggleSwitch from 'primevue/toggleswitch'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  type LocoKitFormField,
  type LocoKitMessage,
} from '@locokit/definitions'
import SingleTag from '../../ui/single-tag/single-tag.vue'
import { format } from 'date-fns'
import {
  LocoKitFormFieldAutocomplete,
  LocoKitFormFieldSingleSelect,
  LocoKitFormFieldTextarea,
  LocoKitTableFieldValue,
  LocoKitTableRecordEnhanced,
} from '@locokit/definitions/dist/fieldType'

const { t } = useI18n()

const emit = defineEmits<{
  submit: [values: Record<string, LocoKitTableFieldValue>]
  delete: []
  cancel: []
  complete: [
    event: AutoCompleteCompleteEvent,
    field: LocoKitFormFieldAutocomplete,
    values: Record<string, unknown>,
  ]
}>()

type ButtonProp = {
  enabled: boolean
  label?: string
  icon?: string
  loadingIcon?: string
}

const props = withDefaults(
  defineProps<{
    fields: LocoKitFormField[]
    initialValues?: Record<
      string,
      string | number | boolean | Object | null | string[] | number[] | boolean[]
    >
    loading?: boolean
    /**
     * Form button configuration,
     * 4 buttons are available
     */
    buttons?: {
      submit?: ButtonProp
      reset?: ButtonProp
      cancel?: ButtonProp
      delete?: ButtonProp
    }
    /** How to display submit buttons, default to sticky */
    buttonPosition?: 'sticky' | 'block'
    /** A message to display into the form, just above the buttons. */
    message?: LocoKitMessage | null
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
     * Build a default object with all fields id to null
     * before hydration with form values
     * (default true)
     */
    buildResultWithNull?: boolean
  }>(),
  {
    fields: () => [],
    initialValues: () => ({}),
    loading: false,
    buttons: () => ({
      submit: { enabled: true },
      reset: { enabled: false },
      cancel: { enabled: true },
      delete: { enabled: false },
    }),
    buttonPosition: 'sticky',
    labels: () => ({}),
    autocompleteSuggestions: () => [],
    relatedRecords: () => ({}),
    buildResultWithNull: true,
  },
)

const formRef = ref()

const autocompleteSelectedOptions = ref<Record<string, unknown>>({})

const buttonLabels = computed(() => {
  return {
    submit: props.buttons.submit?.label ?? t('locokit.components.formGeneric.submit'),
    reset: props.buttons.reset?.label ?? t('locokit.components.formGeneric.reset'),
    cancel: props.buttons.cancel?.label ?? t('locokit.components.formGeneric.cancel'),
    delete: props.buttons.delete?.label ?? t('locokit.components.formGeneric.delete'),
  }
})

type GenericFormField = LocoKitFormField & {
  validationRules?: {
    required?: boolean
    match?: string
    regex?: RegExp
    maxLength?: number
    minLength?: number
  }
}

function computeFieldsDisplayed(
  state: Record<string, FormFieldState | string | number>,
  getValueFn: (
    state: Record<string, FormFieldState | string | number>,
    id: string,
  ) => string | number = (state, id) => state[id] as string | number,
): GenericFormField[] {
  // console.groupCollapsed('fieldsDisplayed computing')
  // console.log(state, Object.keys(state).length)
  const result: LocoKitFormField[] = []
  function getFieldDescription(f: LocoKitFormField) {
    if (!f.description) return undefined
    return Array.isArray(f.description) ? f.description : [f.description]
  }
  props.fields.forEach((f) => {
    // console.groupCollapsed(f.id)

    let isDisplayed =
      f.settings?.default?.display?.visible !== undefined
        ? f.settings?.default.display.visible
        : true

    let isRequired =
      f.settings?.default?.validation?.required !== undefined
        ? f.settings?.default.validation?.required
        : false

    /**
     * For each display rule,
     * compute impacts if rule is enabled
     */
    f.settings?.rules?.forEach((r) => {
      // console.log('rule', r, state)
      let ruleEnabled: boolean | undefined = undefined
      r.conditions.forEach((currentCondition) => {
        const foreignFieldValue = getValueFn(state, currentCondition.fieldId)
        let currentConditionEnabled: boolean | undefined = undefined
        // console.log('condition', currentCondition, foreignFieldValue)
        // if (!foreignFieldValue) return
        switch (currentCondition.operator) {
          case '$eq':
            currentConditionEnabled = foreignFieldValue === currentCondition.value
            break
          case '$neq':
            currentConditionEnabled = foreignFieldValue !== currentCondition.value
            break
          case '$in':
            currentConditionEnabled = (currentCondition.value as unknown[]).includes(
              foreignFieldValue,
            )
            break
          default:
            console.warn(
              'Operator for conditional display not yet implemented: ' + currentCondition.operator,
            )
        }
        if (ruleEnabled === undefined) {
          ruleEnabled = currentConditionEnabled
        } else {
          ruleEnabled = ruleEnabled && currentConditionEnabled
        }
      })
      // console.log('rule', r, ruleEnabled)
      if (ruleEnabled) {
        if (r.impact?.display?.visible !== undefined) {
          isDisplayed = r.impact.display.visible
        }
        if (r.impact?.validation?.required !== undefined) {
          isRequired = isRequired || r.impact?.validation?.required
        }
      }
    })
    // console.log(f.id, 'displayed ?', isDisplayed, 'required ?', isRequired)
    if (isDisplayed) {
      const newField: GenericFormField = {
        ...f,
        description: getFieldDescription(f),
      }
      if (f.readonly) {
        newField.displayValue =
          f.displayValue?.(
            (state[f.id] as FormFieldState)?.value ||
              (state[f.id] as string | number) ||
              props.initialValues[f.id],
            props.initialValues,
            props.relatedRecords,
          ) ||
          (state[f.id] as FormFieldState)?.value ||
          (state[f.id] as string | number) ||
          props.initialValues[f.id]
      }
      if (isRequired !== undefined) {
        newField.validationRules = {
          ...(f.settings?.default?.validation || {}),
          required: isRequired,
        }
      }
      result.push(newField)
      // console.log('added')
    }
    // console.groupEnd()
  })
  // console.log('nb items', result.length)
  // console.groupEnd()
  return result
}

/**
 * Fields to be displayed in the form,
 * according some conditional displayed rules
 *
 * Compute also the fact the field is required
 */
const fieldsDisplayed = (state: Record<string, FormFieldState>) => {
  return computed(() => {
    return computeFieldsDisplayed(state, (state, id) => (state[id] as FormFieldState)?.value)
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

function getSelectOptionLabel(
  option: Record<number | string, string> | string,
  field: LocoKitFormFieldSingleSelect,
): string {
  if (typeof option === 'object' && field.source.label) {
    return option[field.source.label]
  }

  return option as string
}

function getSelectOptionValue(
  option: Record<number | string, string>,
  field: LocoKitFormFieldSingleSelect,
) {
  if (!option) return null
  if (typeof option === 'object' && field.source.value) {
    return option[field.source.value]
  }

  return option
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

/**
 * Resolver to say if the form is OK regarding validation rules
 * (required only actually)
 */
const resolver = ({ values }: FormResolverOptions) => {
  const errors: Record<string, { message: string }[]> = {}
  const fields = computeFieldsDisplayed(values)
  fields.forEach((f) => {
    errors[f.id] = []
    if (f.validationRules?.required) {
      /**
       * Add an error according to the field type
       */
      switch (f.type) {
        case FIELD_TYPE.BOOLEAN:
          if (values[f.id] === undefined || values[f.id] === null)
            errors[f.id].push({
              message: t('locokit.validations.messages.required', { field: f.label }),
            })
          break
        case FIELD_TYPE.NUMBER:
          if (values[f.id] === undefined || values[f.id] === null)
            errors[f.id].push({
              message: t('locokit.validations.messages.required', { field: f.label }),
            })
          if (typeof values[f.id] !== 'number')
            errors[f.id].push({
              message: t('locokit.validations.messages.numberValid', { field: f.label }),
            })
          break
        default:
          if (!values[f.id]) {
            errors[f.id].push({
              message: t('locokit.validations.messages.required', { field: f.label }),
            })
          }
      }
    }
    if (f.validationRules?.match) {
      if (values[f.id] !== values[f.validationRules?.match])
        errors[f.id].push({
          message: t('locokit.validations.messages.mismatch', {
            field: f.label,
            target: f.validationRules.match,
          }),
        })
    }
    if (f.validationRules?.regex) {
      const regexp = new RegExp(f.validationRules.regex)
      if (!regexp.test(values[f.id]))
        errors[f.id].push({
          message: t('locokit.validations.messages.regex', { field: f.label }),
        })
    }
    if (
      f.validationRules?.maxLength &&
      (values[f.id] as string).length > f.validationRules.maxLength
    ) {
      errors[f.id].push({
        message: t('locokit.validations.messages.maxLength', {
          field: f.label,
          maxLength: f.validationRules.maxLength,
        }),
      })
    }
    if (
      f.validationRules?.minLength &&
      (values[f.id] as string).length < f.validationRules.minLength
    ) {
      errors[f.id].push({
        message: t('locokit.validations.messages.minLength', {
          field: f.label,
          minLength: f.validationRules.minLength,
        }),
      })
    }
  })
  return {
    errors,
  }
}

/**
 * Here we build the data to be sent to the API
 *
 * We base our extraction from the states,
 *
 * Indeed, according to the use case of the user,
 * he can overwrite some data that we should sent to the API.
 *
 * If we use only fields displayed,
 * we could bypass some use cases where the record
 * was having some field set, and by changing some fields,
 * the data has been override.
 */
function extractValuesFromStates(states: Record<string, FormFieldState>) {
  console.groupCollapsed('[generic-form] extract values')
  const values: Record<string, LocoKitTableFieldValue> = {}
  console.info('current states', JSON.parse(JSON.stringify(states)))
  /**
   * Init the result by setting each field value a null
   */
  if (props.buildResultWithNull === true) {
    props.fields.forEach((f) => (values[f.id] = null))
  }

  console.info(
    'after buildResultWithNull',
    props.buildResultWithNull,
    JSON.parse(JSON.stringify(values)),
  )

  const fields = computeFieldsDisplayed(states, (state, id) => (state[id] as FormFieldState)?.value)
  console.debug('fields compute', fields)

  fields.forEach((currentField) => {
    const fieldId = currentField.id
    if (typeof states[fieldId] !== 'object' || !('value' in states[fieldId])) {
      return
    }
    values[fieldId] = states[fieldId].value
    switch (currentField.component) {
      // Special handling of autocomplete fields whose suggestions can be objects
      // and not just strings.
      case FIELD_COMPONENT.AUTOCOMPLETE:
        if (fieldId in autocompleteSelectedOptions.value) {
          const option = autocompleteSelectedOptions.value[fieldId] as Record<
            string,
            LocoKitTableFieldValue
          >
          if (!option) return
          const valueProp = (currentField as LocoKitFormFieldAutocomplete).source.value
          values[fieldId] = valueProp ? option[valueProp] : option
        }
        break
      // Special handling of single select fields whose suggestions can be objects
      // and not just strings or numbers.
      case FIELD_COMPONENT.SINGLE_SELECT:
        values[fieldId] = getSelectOptionValue(
          states[fieldId].value,
          currentField as LocoKitFormFieldSingleSelect,
        )
        break
      // Special handling for datetime, need to be returned in the format YYYY-MM-ddTHH:mm:ss
      case FIELD_COMPONENT.INPUT_DATETIME:
        const datetimeValue = states[fieldId].value as string
        if (datetimeValue?.length === 16) {
          values[fieldId] = format(new Date(datetimeValue), "yyyy-MM-dd'T'HH:mm:ss")
        }
        break
    }
  })
  console.log(JSON.parse(JSON.stringify(values)))
  console.groupEnd()
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
  formState: Record<string, FormFieldState>,
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

<script lang="ts">
export type GenericFormInitialValues = Record<string, string | number | boolean | Object | null>
</script>
