<template>
  <div>
    <generic-form
      :fields
      :loading
      :buttons="{
        submit: {
          enabled: true,
          label: t('locokit.components.signInForm.signIn'),
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
      :message="message"
      @submit="onSubmit"
    />

    <div class="mt-4 flex justify-center">
      <a v-if="displaySignUpLink" :href="signUpRoute" class="w-fit text-md">
        {{ t('locokit.components.signInForm.signUp') }}
      </a>
    </div>
    <div class="mt-4 flex justify-center">
      <a v-if="displayLostPasswordLink" :href="lostPasswordRoute" class="w-fit text-md">
        {{ t('locokit.components.signInForm.forgottenPassword') }}
      </a>
    </div>
  </div>
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
import GenericForm from '@/components/commons/generic-form/generic-form.vue'

const { t } = useI18n()

const emit = defineEmits<{
  submit: [
    form: {
      email: string
      password: string
    },
  ]
}>()

withDefaults(
  defineProps<{
    loading?: boolean
    message?: LocoKitMessage
    displaySignUpLink?: boolean
    signUpRoute?: string
    displayLostPasswordLink?: boolean
    lostPasswordRoute?: string
  }>(),
  {
    loading: false,
    displaySignUpLink: false,
    signUpRoute: '',
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
