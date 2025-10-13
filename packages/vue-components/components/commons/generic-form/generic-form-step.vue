<template>
  <PrimeForm
    v-slot="states"
    :resolver
    @submit="onFormSubmit"
    :initial-values="localData"
    validate-on-blur
    :validate-on-value-update="false"
    ref="formRef"
  >
    <slot name="top" />
    <slot>
      <div class="flex flex-col gap-1" v-if="step.array">
        <prime-card
          v-for="idx in nbRecords"
          class="my-2 border !shadow-none !rounded-md"
          :key="idx - 1"
        >
          <template #title>
            <div class="flex justify-between items-center border-b pb-2">
              <h3 class="text-xl font-medium">
                {{ step.recordTitle?.(states, idx - 1) }}
              </h3>
              <prime-button
                v-if="buttons.removeRecord?.enabled"
                type="button"
                @click="removeRecord(idx)"
                class="p-2 m-2 font-medium border"
                severity="danger"
                outlined
              >
                <span class="hidden md:flex font-normal"> {{ buttonLabels.removeRecord }} </span>
                <i :class="buttons.removeRecord.icon ?? 'pi pi-times'" />
              </prime-button>
            </div>
          </template>
          <template #content>
            <template
              v-for="f in fieldsDisplayed(states).value.filter((f) =>
                f.id.startsWith(`form_${idx - 1}`),
              )"
              :key="f.id"
            >
              <GenericFormFieldComponent
                :fields="step.fields!"
                :f
                :autocomplete-suggestions
                :related-records
                :states
                :array-idx="idx"
                @complete="($event, field) => onComplete($event, field, states)"
              />
            </template>
          </template>
        </prime-card>

        <prime-button
          v-if="buttons.addRecord?.enabled"
          type="button"
          @click.stop="addRecord"
          class="p-2 m-2 mb-4 mx-auto font-medium border"
          severity="info"
          :disabled="step.maxRecords ? nbRecords >= step.maxRecords : false"
          :label="buttonLabels.addRecord"
          :icon="buttons.addRecord.icon ?? 'bi bi-plus-circle'"
          :iconPos="buttons.addRecord.iconPos ?? 'left'"
        />
      </div>

      <div class="flex flex-col gap-1" v-else>
        <template v-for="f in fieldsDisplayed(states).value" :key="f.id">
          <GenericFormFieldComponent
            :fields="step.fields!"
            :f
            :autocomplete-suggestions
            :related-records
            :states
            @complete="($event, field) => onComplete($event, field, states)"
          />
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
          v-if="buttons.previous?.enabled"
          severity="primary"
          :disabled="loading"
          @click="emit('previous')"
          :label="buttonLabels.previous"
          :icon="buttons.previous.icon"
          :icon-pos="buttons.previous.iconPos ?? 'left'"
        />
        <PrimeButton
          v-if="buttons.submit?.enabled"
          type="submit"
          severity="primary"
          :disabled="formDisabled"
          :label="buttonLabels.submit"
          :icon="loading ? buttons.submit?.loadingIcon : buttons.submit.icon"
          :icon-pos="buttons.submit.iconPos ?? 'right'"
        />
        <PrimeButton
          v-if="buttons.cancel?.enabled"
          severity="secondary"
          :label="buttonLabels.cancel"
          :disabled="loading"
          @click="emit('cancel')"
          :icon="buttons.cancel.icon"
          :icon-pos="buttons.cancel.iconPos ?? 'right'"
        />
        <PrimeButton
          v-if="buttons.reset?.enabled"
          type="reset"
          :label="buttonLabels.reset"
          :disabled="loading"
          :icon="buttons.reset.icon"
          :icon-pos="buttons.reset.iconPos ?? 'right'"
        />
        <PrimeButton
          v-if="buttons.delete?.enabled"
          :disabled="loading"
          severity="danger"
          :label="buttonLabels.delete"
          :icon="loading ? buttons.delete?.loadingIcon : buttons.delete.icon"
          :icon-pos="buttons.delete.iconPos ?? 'right'"
          @click="emit('delete')"
        />
      </div>
    </slot>
  </PrimeForm>
</template>

<script setup lang="ts">
// correlated to PrimeVue forms "states" / v-slot
import { computed, onMounted, provide, ref, toValue, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  type FormFieldState,
  type FormInstance,
  type FormResolverOptions,
  type FormSubmitEvent,
  Form as PrimeForm,
} from '@primevue/forms'
import { type AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import PrimeButton, { type ButtonProps } from 'primevue/button'
import PrimeCard from 'primevue/card'
import PrimeMessage from 'primevue/message'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  type LocoKitFormField,
  type LocoKitMessage,
  LocoKitFormFieldAutocomplete,
  LocoKitFormFieldSingleSelect,
  LocoKitTableFieldValue,
  LocoKitTableRecordEnhanced,
} from '@locokit/shared'
import { format } from 'date-fns'
import type { FormRecordStep, FormValues, GenericFormField } from '@/declaration'
import GenericFormFieldComponent from './generic-form-field.vue'

const { t } = useI18n()

const emit = defineEmits<{
  submit: [
    values: Record<string, LocoKitTableFieldValue> | Record<string, LocoKitTableFieldValue>[],
  ]
  delete: []
  cancel: []
  previous: []
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
  iconPos?: ButtonProps['iconPos']
  loadingIcon?: string
}

const props = withDefaults(
  defineProps<{
    // fields: LocoKitFormField[]
    step: FormRecordStep
    initialValues?: FormValues | FormValues[]
    loading?: boolean
    /**
     * Form button configuration,
     * 4 buttons are available
     */
    buttons?: {
      previous?: ButtonProp
      submit?: ButtonProp
      reset?: ButtonProp
      cancel?: ButtonProp
      delete?: ButtonProp
      addRecord?: ButtonProp
      removeRecord?: ButtonProp
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
    // fields: () => [],
    step: () => ({
      label: 'unknown',
      fields: [],
    }),
    initialValues: (props) => {
      if (props.step.array) return []
      else return {}
    },
    loading: false,
    buttons: () => ({
      previous: { enabled: false },
      submit: { enabled: true, icon: '', iconPos: 'right' },
      reset: { enabled: false },
      cancel: { enabled: true },
      delete: { enabled: false },
      addRecord: { enabled: false },
      removeRecord: { enabled: false },
    }),
    buttonPosition: 'sticky',
    labels: () => ({}),
    autocompleteSuggestions: () => [],
    relatedRecords: () => ({}),
    buildResultWithNull: true,
  },
)

/**
 * Boolean to indicate it
 * * the form is loading (we cannot submit anymore)
 * * the nb of items is not respectful of constraints (min/max)
 */
const formDisabled = computed(() => {
  if (props.loading) return true
  if (props.step.array) {
    if (
      (props.step.minRecords && nbRecords.value < props.step.minRecords) ||
      (props.step.maxRecords && nbRecords.value > props.step.maxRecords)
    ) {
      return true
    }
  }
  return false
})

const formRef = ref<FormInstance>()
provide('formRef', formRef)

const autocompleteSelectedOptions = ref<Record<string, unknown>>({})

const buttonLabels = computed(() => {
  return {
    previous: props.buttons.previous?.label ?? t('locokit.components.formGeneric.previous'),
    submit: props.buttons.submit?.label ?? t('locokit.components.formGeneric.submit'),
    reset: props.buttons.reset?.label ?? t('locokit.components.formGeneric.reset'),
    cancel: props.buttons.cancel?.label ?? t('locokit.components.formGeneric.cancel'),
    delete: props.buttons.delete?.label ?? t('locokit.components.formGeneric.delete'),
    addRecord: props.buttons.addRecord?.label ?? t('locokit.components.formGeneric.addRecord'),
    removeRecord:
      props.buttons.removeRecord?.label ?? t('locokit.components.formGeneric.removeRecord'),
  }
})

/**
 * Simple object for referencing field by their ids
 */
const fieldsById = computed<Record<string, LocoKitFormField>>(() => {
  const result: Record<string, LocoKitFormField> = {}
  props.step.fields?.forEach((f) => (result[f.id] = f))
  return result
})
/**
 * Field id, if current step form is an array or not
 */
function getFieldId(field: LocoKitFormField): string
function getFieldId(
  field: LocoKitFormField,
  isArray: boolean,
  idx?: number,
  prefix?: string,
): string
function getFieldId(
  field: LocoKitFormField,
  isArray: boolean = false,
  idx: number = 0,
  prefix: string = 'form',
): string {
  if (!isArray) return field.id
  return `${prefix}_${idx}_${field.id}`
}
function getFieldDescription(f: LocoKitFormField) {
  if (!f.description) return undefined
  return Array.isArray(f.description) ? f.description : [f.description]
}
function getFormField(
  f: LocoKitFormField,
  state: Record<string, FormFieldState | string | number>,
  getValueFn: (
    state: Record<string, FormFieldState | string | number>,
    id: string,
  ) => string | number,
): { field: GenericFormField; isDisplayed: boolean }
function getFormField(
  f: LocoKitFormField,
  state: Record<string, FormFieldState | string | number>,
  getValueFn: (
    state: Record<string, FormFieldState | string | number>,
    id: string,
  ) => string | number = (state, id) => state[id] as string | number,
  isArray: boolean = false,
  idx?: number,
  prefix?: string,
): { field: GenericFormField; isDisplayed: boolean } {
  const fieldId = getFieldId(f, isArray, idx, prefix)
  const newField: GenericFormField = {
    ...f,
    id: fieldId,
    description: getFieldDescription(f),
  }

  // console.groupCollapsed(f.id)

  let isDisplayed =
    f.settings?.default?.display?.visible !== undefined ? f.settings?.default.display.visible : true

  let isRequired =
    f.settings?.default?.validation?.required !== undefined
      ? f.settings?.default.validation?.required
      : false

  let match =
    f.settings?.default?.validation?.match !== undefined
      ? f.settings?.default.validation?.match
      : undefined

  /**
   * For each display rule,
   * compute impacts if rule is enabled
   */
  f.settings?.rules?.forEach((r) => {
    // console.log('rule', r, state)
    let ruleEnabled: boolean | undefined = undefined
    r.conditions.forEach((currentCondition) => {
      const foreignField = fieldsById.value[currentCondition.fieldId] as LocoKitFormField
      const foreignFieldId = getFieldId(foreignField, isArray, idx, prefix)

      const foreignFieldValue = getValueFn(state, foreignFieldId)
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
        case '$nin':
          currentConditionEnabled = !(currentCondition.value as unknown[]).includes(
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
      if (r.impact?.validation?.match !== undefined) {
        match = match || r.impact?.validation?.match
      }
    }
  })
  // console.log(f.id, 'displayed ?', isDisplayed, 'required ?', isRequired)
  if (f.readonly) {
    newField.displayValue =
      f.displayValue?.(
        (state[f.id] as FormFieldState)?.value ||
          (state[f.id] as string | number) ||
          (props.initialValues as FormValues[])?.[idx]?.[f.id] ||
          (props.initialValues as FormValues)[f.id],
        props.initialValues,
        props.relatedRecords,
      ) ||
      (state[f.id] as FormFieldState)?.value ||
      (state[f.id] as string | number) ||
      (props.initialValues as FormValues[])?.[idx]?.[f.id] ||
      (props.initialValues as FormValues)[f.id]
  }
  if (isRequired !== undefined) {
    newField.validationRules = {
      ...(f.settings?.default?.validation || {}),
      required: isRequired,
      match,
    }
  }
  /**
   * Compute attrs if it is a function
   * (TO BE TESTED)
   */
  // if (typeof f.attrs === 'function') {
  //   newField.attrs = f.attrs($field, values, props.relatedRecords)
  // } else {
  //   newField.attrs = f.attrs
  // }
  return {
    field: newField,
    isDisplayed,
  }
}

function getFieldsDisplayed(
  state: Record<string, FormFieldState | string | number>,
  getValueFn: (
    state: Record<string, FormFieldState | string | number>,
    id: string,
  ) => string | number = (state, id) => state[id] as string | number,
): GenericFormField[] {
  // console.groupCollapsed('fieldsDisplayed computing')
  // console.log(state, Object.keys(state).length)
  const result: LocoKitFormField[] = []

  if (props.step.array) {
    for (let idx = 0; idx < nbRecords.value; idx++) {
      props.step.fields?.forEach((f) => {
        const currentFormField = getFormField(
          f,
          state,
          getValueFn,
          true,
          idx /*, props.step.property */,
        )
        if (currentFormField.isDisplayed) result.push(currentFormField.field)
        // console.groupEnd()
      })
    }
  } else {
    props.step.fields?.forEach((f) => {
      const currentFormField = getFormField(f, state, getValueFn)
      if (currentFormField.isDisplayed) result.push(currentFormField.field)
      // console.groupEnd()
    })
  }
  // console.groupEnd()
  return result
}

/**
 * Compute the fields to display,
 * regarding the number of records to display
 */
const fieldsDisplayed = (state: Record<string, FormFieldState>) => {
  return computed(() => {
    return getFieldsDisplayed(
      state,
      function getValueFormState(state: Record<string, FormFieldState>, fieldId: string) {
        const foreignField = fieldsById.value[fieldId] as LocoKitFormField
        let value = state[fieldId]?.value
        switch (foreignField.component) {
          case FIELD_COMPONENT.SINGLE_SELECT:
          case FIELD_COMPONENT.AUTOCOMPLETE:
            value = value?.[foreignField.source.value]
            break
        }

        return value
      },
    )
  })
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

/**
 * Resolver to say if the form is OK regarding validation rules
 * * required
 * * match (not for arrays)
 * * regex (not for arrays)
 * * maxLength
 * * minLength
 *
 * For array forms, check the min / max records authorized
 */
const resolver = ({ values }: FormResolverOptions) => {
  const errors: Record<string, { message: string }[]> = {}
  const fields = getFieldsDisplayed(values)

  /**
   * Check min/max records for array forms
   */
  if (props.step.array) {
    if (props.step.minRecords && nbRecords.value < props.step.minRecords) {
      errors.minRecords = [
        {
          message: t('locokit.validations.messages.minRecords', {
            nb: nbRecords.value,
          }),
        },
      ]
    }
    if (props.step.maxRecords && nbRecords.value > props.step.maxRecords) {
      errors.maxRecords = [
        {
          message: t('locokit.validations.messages.maxRecords', {
            nb: nbRecords.value,
          }),
        },
      ]
    }
  }

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
 * by recombining them and rebuilding arrays if needed.
 * Beware, states can contains old array values even if fields are not displayed
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

  let values: Record<string, LocoKitTableFieldValue> | Record<string, LocoKitTableFieldValue>[]
  if (props.step.array) {
    values = [] as Record<string, LocoKitTableFieldValue>[]
    for (let i = 0; i < nbRecords.value; i++) {
      values.push({})
    }
  } else {
    values = {} as Record<string, LocoKitTableFieldValue>
  }

  console.info('current states', JSON.parse(JSON.stringify(states)))
  /**
   * Init the result by setting each field value a null,
   * depending the step is an array or not
   */
  if (props.buildResultWithNull === true) {
    props.step.fields?.forEach((f) => {
      if (Array.isArray(values)) {
        for (let i = 0; i < nbRecords.value; i++) {
          values[i][f.id] = null
        }
      } else {
        values[f.id] = null
      }
    })
  }

  console.info(
    'after buildResultWithNull',
    props.buildResultWithNull,
    JSON.parse(JSON.stringify(values)),
  )

  const fields = getFieldsDisplayed(states, (state, id) => (state[id] as FormFieldState)?.value)
  console.debug('fields compute', fields)

  fields.forEach((currentField) => {
    const fieldId = currentField.id
    if (typeof states[fieldId] !== 'object' || !('value' in states[fieldId])) {
      return
    }
    let currentValue = states[fieldId].value
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
          currentValue = valueProp ? option[valueProp] : option
        }
        break
      // Special handling of single select fields whose suggestions can be objects
      // and not just strings or numbers.
      case FIELD_COMPONENT.SINGLE_SELECT:
        currentValue = getSelectOptionValue(
          states[fieldId].value,
          currentField as LocoKitFormFieldSingleSelect,
        )
        break
      // Special handling for datetime, need to be returned in the format YYYY-MM-ddTHH:mm:ss
      case FIELD_COMPONENT.INPUT_DATETIME:
        const datetimeValue = states[fieldId].value as string
        if (datetimeValue?.length === 16) {
          currentValue = format(new Date(datetimeValue), "yyyy-MM-dd'T'HH:mm:ss")
        }
        break
    }

    if (Array.isArray(values)) {
      const idx = parseInt(fieldId.substring('form_'.length, 'form_'.length + 1))
      const id = fieldId.substring('form_x_'.length)
      values[idx][id] = currentValue
    } else {
      values[fieldId] = currentValue
    }
  })
  console.log(JSON.parse(JSON.stringify(values)))
  console.groupEnd()

  if (props.step.property) {
    return {
      [props.step.property]: values,
    }
  } else return values
}

function onFormSubmit({ valid, states, errors, values }: FormSubmitEvent) {
  /**
   * Check min / max records if step is an array
   */
  // @ts-expect-error Bad typing of errors from PrimeVue Form
  if (props.step.array && (errors.minRecords || errors.maxRecords)) {
    return
  }

  if (valid) {
    const values = extractValuesFromStates(states)
    emit('submit', values)
  }
}

/**
 * Local "initial data" ,
 * based on initial values (by watch)
 */
const localData = ref()
const nbRecords = ref(props.step.minRecords ?? 0)
function removeRecord(idx: number) {
  if (!props.step.array) return
  nbRecords.value--
}
function addRecord() {
  if (!props.step.array) return
  nbRecords.value++
}

watch(
  () => props.step,
  () => (nbRecords.value = props.step.minRecords ?? 0),
  { deep: true },
)
watch(
  () => [props.step.array, props.step.fields],
  () => {
    if (props.step.array) {
      const flattenInitivalValues: FormValues = {}
      if (!Array.isArray(props.initialValues)) {
        console.warn(
          '[generic-form] Initial values is not an array, but current step yes.',
          props.initialValues,
        )
      }
      nbRecords.value = (props.initialValues as FormValues[]).length
      ;(props.initialValues as FormValues[]).forEach((iv, idx) => {
        for (const property in iv) {
          flattenInitivalValues[`form_${idx}_${property}`] = iv[property]
          /**
           * Rebuild complex values as SINGLE_SELECT
           */
          const currentField = props.step.fields?.find((f) => f.id === property)
          if (!currentField) continue
          if (currentField?.component === FIELD_COMPONENT.SINGLE_SELECT) {
            const matchingOption = (
              currentField as LocoKitFormFieldSingleSelect
            ).source.options.find(
              (o) =>
                o[(currentField as LocoKitFormFieldSingleSelect).source.value] === iv[property],
            )
            if (matchingOption) flattenInitivalValues[`form_${idx}_${property}`] = matchingOption
          }
        }
      })
      localData.value = { ...flattenInitivalValues }
    } else {
      const initialValues = {
        ...(props.initialValues || {}),
      }
      for (const property in props.initialValues) {
        const currentValue = props.initialValues[property]
        /**
         * Rebuild complex values as SINGLE_SELECT
         */
        const currentField = props.step.fields?.find((f) => f.id === property)
        if (!currentField) continue
        if (currentField?.component === FIELD_COMPONENT.SINGLE_SELECT) {
          const matchingOption = (currentField as LocoKitFormFieldSingleSelect).source.options.find(
            (o) => o[(currentField as LocoKitFormFieldSingleSelect).source.value] === currentValue,
          )
          // console.log('single select', matchingOption, property, currentField, currentValue)
          if (matchingOption) initialValues[property] = matchingOption
        }
      }
      localData.value = { ...initialValues }
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  // Initialize autocompleteSelectedOptions variable with initial values
  // of autocomplete fields.
  // TODO: does it work for initial values as Array ?
  for (const key in props.initialValues) {
    // Find the field definition matching the current initial value.
    const field = props.step.fields?.find((item) => item.id === key)
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
</script>
