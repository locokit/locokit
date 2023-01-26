<template>
  <FormGeneric
    :display-reset-button="false"
    :label-button-submit="'components.updatePasswordForm.submit'"
    :display-success-form="true"
    :response="response"
    :loading="loading"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="currentPassword"
      class="mb-4"
      name="updatePasswordForm.currentPassword"
      rules="required"
      as="div"
    >
      <div class="grid grid-cols-3">
        <label for="name" class="label-field-required my-auto">
          {{ $t('components.updatePasswordForm.currentPassword') }}
        </label>

        <div class="col-span-2 w-full">
          <PrimePassword
            v-bind="field"
            v-model="currentPassword"
            input-id="password"
            input-class="w-full"
            :class="{ 'p-invalid': errorMessage }"
            class="!w-4/5 sm:!w-fit md:!w-3/5"
            :toggle-mask="true"
            :feedback="false"
            spellcheck="false"
            autocorrect="off"
            autocapitalize="none"
            required
          />
        </div>
      </div>
      <span
        v-if="errorMessage"
        class="p-text-error"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </span>
    </Field>
    <Field
      v-slot="{ field, errorMessage }"
      class="mb-4"
      name="updatePasswordForm.newPassword"
      :rules="{ required: true, regex: `${regexPasswordRules}(?=.{8,})` }"
      as="div"
    >
      <div class="grid grid-cols-3">
        <label for="name" class="label-field-required my-auto">
          {{ $t('components.updatePasswordForm.newPassword') }}
        </label>

        <div class="w-full col-span-2">
          <PrimePassword
            v-model="newPassword"
            input-id="newPassword"
            input-class="w-full"
            :class="{ 'p-invalid': errorMessage }"
            class="!w-4/5 sm:!w-fit md:!w-3/5"
            v-bind="field"
            :feedback="true"
            :toggle-mask="true"
            :medium-regex="`${regexPasswordRules}(?=.{8,})`"
            :strong-regex="`${regexPasswordRules}(?=.{12,})`"
            :weak-label="
              $t('components.updatePasswordForm.passwordStrength.weak')
            "
            :medium-label="
              $t('components.updatePasswordForm.passwordStrength.medium')
            "
            :strong-label="
              $t('components.updatePasswordForm.passwordStrength.strong')
            "
            :prompt-label="$t('components.updatePasswordForm.prompt')"
            required
            aria-describedby="password-rules"
            autocomplete="new-password"
            spellcheck="false"
            autocorrect="off"
            autocapitalize="none"
            :pattern="regexPasswordRules"
          />
        </div>
      </div>
      <small id="password-rules" class="italic">
        {{ $t('components.updatePasswordForm.rules') }}
      </small>
      <span
        v-if="errorMessage"
        class="p-text-error block"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </span>
    </Field>
    <Field
      v-slot="{ field, errorMessage }"
      class="mb-4"
      name="updatePasswordForm.confirmPassword"
      rules="required|confirmed:updatePasswordForm.newPassword"
      as="div"
    >
      <div class="grid grid-cols-3">
        <label for="name" class="label-field-required my-auto">
          {{ $t('components.updatePasswordForm.confirmPassword') }}
        </label>

        <div class="w-full col-span-2">
          <PrimePassword
            v-model="confirmPassword"
            input-id="confirmPassword"
            input-class="w-full"
            :class="{ 'p-invalid': errorMessage }"
            class="!w-4/5 sm:!w-fit md:!w-3/5"
            v-bind="field"
            :feedback="false"
            :toggle-mask="true"
            required
            spellcheck="false"
            autocorrect="off"
            autocapitalize="none"
          />
        </div>
      </div>
      <span
        v-if="errorMessage"
        class="p-text-error"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </span>
    </Field>
  </FormGeneric>
</template>

<script setup lang="ts">
import PrimePassword from 'primevue/password'
import FormGeneric from '../../FormGeneric/FormGeneric.vue'
import { Field } from 'vee-validate'
import { ref } from 'vue'
import { regexPasswordRules } from '../../../helpers/regex'

const emit = defineEmits<{
  (
    e: 'submit',
    form: {
      currentPassword: string
      newPassword: string
    },
  ): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response?: Error | Record<string, any> | null
  }>(),
  {
    loading: false,
    response: null,
  },
)

const currentPassword = ref()
const newPassword = ref()
const confirmPassword = ref()

const onSubmit = () => {
  emit('submit', {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  })
}
</script>
