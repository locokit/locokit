<template>
  <FormGeneric
    :display-reset-button="false"
    :full-width-button="true"
    label-key-button-submit="components.signUpForm.signup"
    :response="error"
    :loading="loading"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="form.username"
      class="mb-4"
      name="signUpForm.username"
      rules="required"
      as="div"
    >
      <label for="name" class="label-field-required">
        {{ $t('components.signUpForm.username') }}
      </label>
      <PrimeInputText
        id="username"
        v-bind="field"
        v-focus
        :class="{ 'p-invalid': errorMessage }"
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
      v-model="form.email"
      class="mb-4"
      name="signUpForm.email"
      rules="required|email"
      as="div"
    >
      <label for="email" class="label-field-required">
        {{ $t('components.signUpForm.email') }}
      </label>
      <PrimeInputText
        id="email"
        v-bind="field"
        :class="{ 'p-invalid': errorMessage }"
        required
        autocomplete="email"
        type="email"
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
import PrimeInputText from 'primevue/inputtext'
import FormGeneric from '../../FormGeneric/FormGeneric.vue'
import { Field } from 'vee-validate'
import { reactive } from 'vue'

const emit = defineEmits<{
  (e: 'submit', form: { email: string; username: string }): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    error?: Error | null
  }>(),
  {
    loading: false,
    error: null,
  },
)

const form = reactive({
  email: '',
  username: '',
})

const onSubmit = () => {
  emit('submit', form)
}
</script>
