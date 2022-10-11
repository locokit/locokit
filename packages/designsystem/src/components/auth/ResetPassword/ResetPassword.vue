<template>
  <Form
    @submit="onSubmit"
    v-slot="{ meta: { valid } }"
    class="text-left p-fluid"
  >
    <Field
      name="password"
      as="div"
      v-slot="{ field, errorMessage }"
      :rules="{ required: true, regex: `${regexPasswordRules}(?=.{8,})` }"
      class="mb-4 flex flex-col"
    >
      <label for="password" class="label-field-required">{{
        $t('components.resetPassword.password')
      }}</label>
      <PrimePassword
        inputId="password"
        v-model="password"
        v-bind="field"
        :feedback="true"
        :toggleMask="true"
        :mediumRegex="`${regexPasswordRules}(?=.{8,})`"
        :strongRegex="`${regexPasswordRules}(?=.{12,})`"
        :weakLabel="$t('components.resetPassword.passwordStrength.weak')"
        :mediumLabel="$t('components.resetPassword.passwordStrength.medium')"
        :strongLabel="$t('components.resetPassword.passwordStrength.strong')"
        :promptLabel="$t('components.resetPassword.prompt')"
        required
        aria-describedby="password-rules"
        autocomplete="new-password"
        spellcheck="false"
        autocorrect="off"
        autocapitalize="none"
        :pattern="regexPasswordRules"
      />
      <small class="italic" id="password-rules">
        {{ $t('components.resetPassword.rules') }}
      </small>
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
      name="passwordCheck"
      as="div"
      v-slot="{ field, errorMessage }"
      rules="required|confirmed:password"
      class="mb-4 flex flex-col"
      v-model="passwordCheck"
    >
      <label for="passwordCheck" class="label-field-required">{{
        $t('components.resetPassword.passwordCheck')
      }}</label>
      <PrimePassword
        inputId="passwordCheck"
        v-bind="field"
        :feedback="false"
        :toggleMask="true"
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
    <PrimeButton
      type="submit"
      :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
      :label="
        reset
          ? $t('components.resetPassword.resetSubmit')
          : $t('components.resetPassword.setSubmit')
      "
      :disabled="loading || !valid"
      class="mb-2"
    />
    <span
      v-if="error"
      class="mt-4 p-text-error"
      role="alert"
      aria-live="assertive"
    >
      {{ $t('components.resetPassword.error') }}
    </span>
  </Form>
</template>

<script setup lang="ts">
// N.B: We shouldn't use v-model and v-bind in the input according to [vee-validate good practices](https://vee-validate.logaretm.com/v4/api/field/#using-v-model) but without it, Password component of Prime does not work.
// And to date, no side effects have been encountered
import PrimeButton from 'primevue/button'
import PrimePassword from 'primevue/password'
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import { regexPasswordRules } from '../../../helpers/regex'

const emit = defineEmits<{
  (e: 'submit', password: string): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    error?: Error
    reset?: boolean
  }>(),
  {
    loading: () => false,
    reset: () => true,
  },
)
const password = ref('')
const passwordCheck = ref('')

const onSubmit = () => {
  emit('submit', password.value)
}
</script>
