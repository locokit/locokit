<template>
  <generic-form
    :fields
    :buttons="{
      submit: {
        enabled: true,
        label: t('locokit.components.updateGeneralForm.submit'),
      },
      reset: {
        enabled: false,
      },
      cancel: {
        enabled: false,
      },
      delete: {
        enabled: false,
      },
    }"
    :loading="loading"
    :message="message"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  type LocoKitFormField,
  type LocoKitMessage,
} from '@locokit/shared'
//import { regexPasswordRules } from '@/helpers/regex'
import GenericForm from '@/components/commons/generic-form/generic-form.vue'

const { t } = useI18n()

const emit = defineEmits<{
  /**
   * Emitted when the submit button has been clicked
   * and the form has been successfully validated.
   */
  submit: [
    form: {
      currentPassword: string
      newPassword: string
    },
  ]
}>()

withDefaults(
  defineProps<{
    /** Is the form loading? `true` to put it in loading state. */
    loading?: boolean
    /** A message to display into the form, just above the buttons. */
    message?: LocoKitMessage
  }>(),
  {
    loading: false,
  },
)

const fields = computed<LocoKitFormField[]>(() => [
  {
    id: 'currentPassword',
    label: t('locokit.components.updatePasswordForm.currentPassword'),
    type: FIELD_TYPE.TEXT,
    component: FIELD_COMPONENT.INPUT_PASSWORD,
    settings: {
      default: {
        validation: {
          required: true,
          maxLength: 255,
        },
      },
    },
  },
  {
    id: 'newPassword',
    label: t('locokit.components.updatePasswordForm.newPassword'),
    // description: TODO: describe password validation rules
    type: FIELD_TYPE.TEXT,
    component: FIELD_COMPONENT.INPUT_PASSWORD,
    settings: {
      default: {
        validation: {
          required: true,
          maxLength: 255,
          // TODO: check that input matches a regex
        },
      },
    },
  },
  {
    id: 'confirmPassword',
    label: t('locokit.components.updatePasswordForm.confirmPassword'),
    type: FIELD_TYPE.TEXT,
    component: FIELD_COMPONENT.INPUT_PASSWORD,
    settings: {
      default: {
        validation: {
          required: true,
          maxLength: 255,
          // TODO: check that input is identical to the other field's value
        },
      },
    },
  },
])

const onSubmit = (values: Record<string, unknown>) => {
  emit('submit', {
    currentPassword: values.currentPassword as string,
    newPassword: values.newPassword as string,
  })
}
</script>
