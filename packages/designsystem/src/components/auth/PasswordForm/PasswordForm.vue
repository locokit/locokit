<template>
  <Form
    v-slot="{ meta: { valid, touched } }"
    class="text-left"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      name="passwordForm.password"
      as="div"
      :rules="{ required: true, regex: `${regexPasswordRules}(?=.{8,})` }"
      class="mb-4 flex flex-col"
    >
      <label for="password" class="label-field-required">{{
        $t('components.passwordForm.password')
      }}</label>
      <PrimePassword
        v-model="password"
        input-id="password"
        :class="{ 'p-invalid': errorMessage }"
        v-bind="field"
        :feedback="true"
        toggle-mask
        :medium-regex="`${regexPasswordRules}(?=.{8,})`"
        :strong-regex="`${regexPasswordRules}(?=.{12,})`"
        :weak-label="$t('components.passwordForm.passwordStrength.weak')"
        :medium-label="$t('components.passwordForm.passwordStrength.medium')"
        :strong-label="$t('components.passwordForm.passwordStrength.strong')"
        :prompt-label="$t('components.passwordForm.prompt')"
        required
        aria-describedby="password-rules"
        autocomplete="new-password"
        spellcheck="false"
        autocorrect="off"
        autocapitalize="none"
        :pattern="regexPasswordRules"
      />
      <small id="password-rules" class="italic">
        {{ $t('components.passwordForm.rules') }}
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
      v-slot="{ field, errorMessage }"
      name="passwordForm.passwordCheck"
      as="div"
      rules="required|confirmed:passwordForm.password"
      class="mb-4 flex flex-col"
    >
      <label for="passwordCheck" class="label-field-required">
        {{ $t('components.passwordForm.passwordCheck') }}
      </label>
      <PrimePassword
        v-model="passwordCheck"
        input-id="passwordCheck"
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
    <ButtonWithStatus
      type="submit"
      :label-tk="labelTkSubmit"
      class="!w-full border"
      :disabled="loading || !valid || !touched"
      :status-form="error ? 'failed' : null"
      icon="bi bi-save2"
      :is-submitting="loading"
    />
    <MessageForUser v-if="error" status="failed" />
  </Form>
</template>

<script setup lang="ts">
// N.B: We shouldn't use v-model and v-bind in the input according to [vee-validate good practices](https://vee-validate.logaretm.com/v4/api/field/#using-v-model) but without it, Password component of Prime does not work.
// And to date, no side effects have been encountered
import PrimePassword from 'primevue/password'
import ButtonWithStatus from '../../ButtonWithStatus/ButtonWithStatus.vue'
import MessageForUser from '../../MessageForUser/MessageForUser.vue'
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import { regexPasswordRules } from '../../../helpers/regex'

const emit = defineEmits<(e: 'submit', password: string) => void>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    error?: Error | null
    labelTkSubmit: string
  }>(),
  {
    loading: false,
    error: null,
  },
)
const password = ref('')
const passwordCheck = ref('')

const onSubmit = () => {
  emit('submit', password.value)
}
</script>
