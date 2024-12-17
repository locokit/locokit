<template>
  <generic-form
    :fields
    :buttons="{
      submit: true,
      reset: false,
      cancel: false,
    }"
    :labels="{
      submit: t('locokit.components.signUpForm.signUp'),
    }"
    :loading="loading"
    :message="message"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FIELD_COMPONENT, FIELD_TYPE, LocoKitFormField, LocoKitMessage } from '@locokit/definitions'
import GenericForm from '@/components/commons/generic-form/generic-form.vue'

const { t } = useI18n()

const emit = defineEmits<{
  /**
   * Emitted when the submit button has been clicked
   * and the form has been successfully validated.
   */
  (e: 'submit', form: { email: string; username: string }): void
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

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'username',
      label: t('locokit.components.signUpForm.username'),
      type: FIELD_TYPE.TEXT,
      component: FIELD_COMPONENT.INPUT_TEXT,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
    {
      id: 'email',
      label: t('locokit.components.signUpForm.email'),
      type: FIELD_TYPE.EMAIL,
      component: FIELD_COMPONENT.INPUT_EMAIL,
      validationRules: {
        required: true,
        maxLength: 255,
      },
    },
  ]
})

const onSubmit = (values: Record<string, unknown>) => {
  emit('submit', values as { email: string; username: string })
}
</script>
