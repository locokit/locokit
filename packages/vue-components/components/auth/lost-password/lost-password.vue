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
      @submit="onSubmit"
    >
      <template #message>
        <PrimeMessage severity="error" v-if="error" class="my-2">
          {{ error }}
        </PrimeMessage>
      </template>
    </generic-form>

    <div class="mt-4 text-center">
      {{ $t('locokit.components.lostPasswordForm.signInHelp') }}
      <a class :href="signInRoute">
        {{ $t('locokit.components.lostPasswordForm.signIn') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import GenericForm from '../../commons/generic-form/generic-form.vue'
import { FIELD_COMPONENT, FIELD_TYPE, type LocoKitField } from '@locokit/definitions'
import PrimeMessage from 'primevue/message'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<(e: 'submit', email: string) => void>()

withDefaults(
  defineProps<{
    loading?: boolean
    error?: Error | null
    signInRoute: string
  }>(),
  {
    loading: false,
    error: null,
    signInRoute: '/',
  },
)

const fields = computed<LocoKitField[]>(() => {
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
