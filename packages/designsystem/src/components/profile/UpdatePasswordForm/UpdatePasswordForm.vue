<template>
  <FormGeneric
    :display-reset-button="false"
    label-tk-button-submit="locokit.components.updatePasswordForm.submit"
    :response="response"
    :loading="loading"
    class="w-3/4"
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
      <label for="name" class="label-field-required">
        {{ $t('locokit.components.updatePasswordForm.currentPassword') }}
      </label>
      <PrimePassword
        v-bind="field"
        v-model="currentPassword"
        input-id="password"
        :class="{ 'p-invalid': errorMessage }"
        toggle-mask
        :feedback="false"
        spellcheck="false"
        autocorrect="off"
        autocapitalize="none"
        required
      />
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
      <label for="name" class="label-field-required">
        {{ $t('locokit.components.updatePasswordForm.newPassword') }}
      </label>
      <PrimePassword
        v-model="newPassword"
        input-id="newPassword"
        :class="{ 'p-invalid': errorMessage }"
        v-bind="field"
        :feedback="true"
        toggle-mask
        :medium-regex="`${regexPasswordRules}(?=.{8,})`"
        :strong-regex="`${regexPasswordRules}(?=.{12,})`"
        :weak-label="
          $t('locokit.components.updatePasswordForm.passwordStrength.weak')
        "
        :medium-label="
          $t('locokit.components.updatePasswordForm.passwordStrength.medium')
        "
        :strong-label="
          $t('locokit.components.updatePasswordForm.passwordStrength.strong')
        "
        :prompt-label="$t('locokit.components.updatePasswordForm.prompt')"
        required
        aria-describedby="password-rules"
        autocomplete="new-password"
        spellcheck="false"
        autocorrect="off"
        autocapitalize="none"
        :pattern="regexPasswordRules"
      />
      <small id="password-rules" class="italic">
        {{ $t('locokit.components.updatePasswordForm.rules') }}
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
      <label for="name" class="label-field-required">
        {{ $t('locokit.components.updatePasswordForm.confirmPassword') }}
      </label>
      <PrimePassword
        v-model="confirmPassword"
        input-id="confirmPassword"
        :class="{ 'p-invalid': errorMessage }"
        v-bind="field"
        :feedback="false"
        toggle-mask
        required
        spellcheck="false"
        autocorrect="off"
        autocapitalize="none"
      />
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

const emit = defineEmits<
  (
    e: 'submit',
    form: {
      currentPassword: string
      newPassword: string
    },
  ) => void
>()

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
