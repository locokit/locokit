<template>
  <!--
    The actual slot of the PrimeForm is the states property...
    TODO: fix it when PrimeVue will fix this bug
    => typing is false for the template
   -->
  <PrimeForm v-slot="states" :resolver @submit="onFormSubmit">
    <slot name="top" />

    <slot>
      <div class="flex flex-col gap-1">
        <template v-for="f in fieldsDisplayed(states).value" :key="f.id">
          <div class="mb-4">
            <div class="flex items-center">
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
            <PrimeMessage severity="error" v-else>
              Component {{ f.component }} is not yet implemented.
            </PrimeMessage>

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
      <div class="flex items-center justify-center gap-2">
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
import PrimeButton from 'primevue/button'
import PrimeInputText from 'primevue/inputtext'
import PrimeMessage from 'primevue/message'
import PrimePassword from 'primevue/password'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{ submit: [values: Record<string, unknown>] }>()

const props = withDefaults(
  defineProps<{
    fields: LocoKitFormField[]
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
  }>(),
  {
    fields: () => [],
    loading: false,
    buttons: () => ({
      submit: true,
      reset: false,
      cancel: true,
    }),
    labels: () => ({}),
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
      if (isDisplayed) result.push(f)
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
