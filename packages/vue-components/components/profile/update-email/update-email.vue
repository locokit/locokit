<template>
  <generic-form
    :fields
    :buttons="{
      submit: true,
      reset: false,
      cancel: false,
    }"
    :labels="{
      submit: t('locokit.components.updateEmailForm.submit'),
    }"
    :loading="loading"
    :message="message"
    @submit="onSubmit"
  >
    <template #top v-if="currentEmail">
      <div class="mb-4">
        <p>{{ $t('locokit.components.updateEmailForm.currentEmail') }}</p>
        <p class="font-bold">{{ currentEmail }}</p>
      </div>
    </template>
  </generic-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  FIELD_COMPONENT,
  FIELD_TYPE,
  type LocoKitFormField,
  type LocoKitMessage,
} from '@locokit/definitions'
import GenericForm from '@/components/commons/generic-form/generic-form.vue'

const { t } = useI18n()

const emit = defineEmits<{
  /**
   * Emitted when the submit button has been clicked
   * and the form has been successfully validated.
   */
  submit: [
    form: {
      newEmail: string
      password: string
    }
  ]
}>()

withDefaults(
  defineProps<{
    /** The user's current email address. */
    currentEmail?: string
    /** Is the form loading? `true` to put it in loading state. */
    loading?: boolean
    /** A message to display into the form, just above the buttons. */
    message?: LocoKitMessage
  }>(),
  {
    loading: false,
  },
)

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'newEmail',
      label: t('locokit.components.updateEmailForm.newEmail'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_EMAIL,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
    {
      id: 'password',
      label: t('locokit.components.updateEmailForm.password'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_PASSWORD,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
  ]
})

const onSubmit = (values: Record<string, unknown>) => {
  emit('submit', values as {
    newEmail: string
    password: string
  })
}
</script>
