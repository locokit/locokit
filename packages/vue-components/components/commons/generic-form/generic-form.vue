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
            <div class="flex items-center">
              <!-- boolean -->
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

            <PrimeInputText
              v-if="f.component === FIELD_COMPONENT.INPUT_TEXT"
              :name="f.id"
              :id="f.id"
              :class="f.class"
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
            <PrimePassword
              v-else-if="f.component === FIELD_COMPONENT.INPUT_PASSWORD"
              :name="f.id"
              :input-id="f.id"
              :class="f.class"
              fluid
              toggleMask
              :feedback="false"
            />
            <!-- number / float -->
            <PrimeInputNumber
              v-else-if="f.component === FIELD_COMPONENT.INPUT_NUMBER"
              :name="f.id"
              :class="f.class"
              :inputId="f.id"
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
              fluid
              show-icon
              icon-display="input"
              append-to="body"
              :show-time="f.component === FIELD_COMPONENT.INPUT_DATETIME"
              :type="f.component === FIELD_COMPONENT.INPUT_DATE ? 'date' : 'datetime-local'"
            />
            <!-- single select -->
            <PrimeSelect
              v-else-if="f.component === FIELD_COMPONENT.SINGLE_SELECT"
              :name="f.id"
              :class="f.class"
              :labelId="f.id"
              fluid
              :options="f.source.options"
              :showClear="true"
              :placeholder="t('locokit.components.primeDropdown.placeholder')"
              class="mb-2 w-full"
            >
              <template #value="slotProps">
                <single-tag
                  v-if="slotProps.value"
                  :label="slotProps.value[f.source.label]"
                  :color="slotProps.value[f.source.colorFields?.text]"
                  :backgroundColor="slotProps.value[f.source.colorFields?.background]"
                />
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <single-tag
                  :label="slotProps.option[f.source.label]"
                  :color="slotProps.option[f.source.colorFields?.text]"
                  :backgroundColor="slotProps.option[f.source.colorFields?.background]"
                />
              </template>
            </PrimeSelect>

            <!-- autocomplete -->
            <PrimeAutocomplete
              v-else-if="f.component === FIELD_COMPONENT.AUTOCOMPLETE"
              :name="f.id"
              :class="f.class"
              :inputId="f.id"
              :forceSelection="false"
              dropdown
              dropdown-mode="current"
              :placeholder="t('locokit.components.primeAutocomplete.placeholder')"
              fluid
              :option-label="f.source.label"
              :suggestions="props.autocompleteSuggestions"
              @complete="emit('complete', f, $event)"
              input-class="w-full border-r-0 hover:border-surface-500 "
              dropdown-class="bg-transparent hover:bg-transparent primary border-l-0 border-surface-300 text-surface-500 hover:border-surface-500 w-12"
            />

            <PrimeMessage
              severity="error"
              v-else-if="f.component !== FIELD_COMPONENT.TOGGLE_SWITCH"
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
      <div class="flex items-center justify-center gap-2 sticky bottom-0 drop-shadow-lg">
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
import {
  FormFieldState,
  FormResolverOptions,
  FormSubmitEvent,
  Form as PrimeForm,
} from '@primevue/forms'

import { FIELD_COMPONENT, type LocoKitFormField, type LocoKitMessage } from '@locokit/definitions'

import PrimeAutocomplete, { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import PrimeButton from 'primevue/button'
import PrimeInputText from 'primevue/inputtext'
import PrimeInputNumber from 'primevue/inputnumber'
import PrimeMessage from 'primevue/message'
import PrimePassword from 'primevue/password'
import PrimeDatePicker from 'primevue/datepicker'
import PrimeSelect from 'primevue/select'
import PrimeToggleSwitch from 'primevue/toggleswitch'

import SingleTag from '../../ui/single-tag/single-tag.vue'

import { computed, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  submit: [values: Record<string, unknown>]
  complete: [field: LocoKitFormFieldAutocomplete, event: AutoCompleteCompleteEvent]
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
    labels: () => ({}),
    autocompleteSuggestions: () => [],
  },
)

const buttonLabels = computed(() => {
  return {
    submit: props.labels.submit ?? t('locokit.components.formGeneric.submit'),
    reset: props.labels.reset ?? t('locokit.components.formGeneric.reset'),
    cancel: props.labels.cancel ?? t('locokit.components.formGeneric.cancel'),
  }
})

const fieldsDisplayed = (state: Record<string, FormFieldState>) =>
  computed(() => {
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

const onFormSubmit = ({ valid, states }: FormSubmitEvent) => {
  const values = {}
  Object.keys(states).forEach((stateKey) => {
    values[stateKey] = states[stateKey].value
  })

  if (valid) emit('submit', values)
}
</script>
