<template>
  <div>
    <generic-form
      :fields
      :loading
      :buttons="{
        submit: true,
        reset: false,
        cancel: false,
      }"
      :labels="{
        submit: t('locokit.components.signInForm.signIn'),
      }"
      :message="message"
      @submit="onSubmit"
    />

    <div class="mt-4 text-center">
      {{ $t('locokit.components.lostPasswordForm.signInHelp') }}
      <a class :href="signInRoute">
        {{ $t('locokit.components.lostPasswordForm.signIn') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FIELD_COMPONENT, FIELD_TYPE, type LocoKitFormField, type LocoKitMessage } from '@locokit/definitions'
import GenericForm from '@/components/commons/generic-form/generic-form.vue'

const { t } = useI18n()

const emit = defineEmits<{ submit: [email: string] }>()

withDefaults(
  defineProps<{
    /** Is the form loading? `true` to put it in loading state. */
    loading?: boolean
    /** A message to display into the form, just above the buttons. */
    message?: LocoKitMessage
    /** Route to the sign-in form. */
    signInRoute?: string
  }>(),
  {
    loading: false,
    signInRoute: '/',
  },
)

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'email',
      label: t('locokit.components.lostPasswordForm.email'),
      type: FIELD_TYPE.EMAIL,
      component: FIELD_COMPONENT.INPUT_EMAIL,
      validationRules: {
        required: true,
      },
    },
  ]
})

const onSubmit = (values: Record<string, unknown>) => {
  emit('submit', values.email as string)
}
</script>
