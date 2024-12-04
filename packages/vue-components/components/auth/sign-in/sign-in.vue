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

    <div class="mt-4 pl-6 flex justify-center">
      <a v-if="displaySignUpLink" :href="signupRoute" class="w-fit text-md">
        {{ t('locokit.components.signInForm.signUp') }}
      </a>
    </div>
    <div class="mt-4 pl-6 flex justify-center">
      <a v-if="displayLostPasswordLink" :href="lostPasswordRoute" class="w-fit text-md">
        {{ t('locokit.components.signInForm.forgottenPassword') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import GenericForm from '../../commons/generic-form/generic-form.vue'
import { FIELD_COMPONENT, FIELD_TYPE, type LocoKitFormField } from '@locokit/definitions'
import PrimeMessage from 'primevue/message'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<(e: 'submit', form: { email: string; password: string }) => void>()

withDefaults(
  defineProps<{
    loading?: boolean
    error?: Error | null
    displaySignUpLink?: boolean
    signupRoute?: string
    displayLostPasswordLink?: boolean
    lostPasswordRoute?: string
  }>(),
  {
    loading: false,
    error: null,
    displaySignUpLink: false,
    signupRoute: '',
    displayLostPasswordLink: false,
    lostPasswordRoute: '',
  },
)

const fields = computed<LocoKitFormField[]>(() => {
  return [
    {
      id: 'email',
      label: t('locokit.components.signInForm.email'),
      type: FIELD_TYPE.EMAIL,
      component: FIELD_COMPONENT.INPUT_EMAIL,
      validationRules: {
        required: true,
      },
    },
    {
      id: 'password',
      label: t('locokit.components.signInForm.password'),
      type: FIELD_TYPE.STRING,
      component: FIELD_COMPONENT.INPUT_PASSWORD,
      validationRules: {
        required: true,
        minLength: 8,
      },
    },
  ]
})

const onSubmit = (values: Record<string, unknown>) => {
  emit('submit', values as { email: string; password: string })
}
</script>
