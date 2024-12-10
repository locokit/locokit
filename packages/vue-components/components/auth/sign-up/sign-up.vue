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
    @submit="onSubmit"
  >
    <template #message>
      <PrimeMessage
        v-if="error"
        severity="error"
        class="my-2"
        data-testid="global-error"
      >
        {{ error }}
      </PrimeMessage>
    </template>
  </generic-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PrimeMessage from "primevue/message";
import { FIELD_COMPONENT, FIELD_TYPE, LocoKitFormField } from '@locokit/definitions'
import GenericForm from '@/components/commons/generic-form/generic-form.vue'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'submit', form: { email: string; username: string }): void
}>()

withDefaults(
  defineProps<{
    loading?: boolean
    error?: Error | null
  }>(),
  {
    loading: false,
    error: null,
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
