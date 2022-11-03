<template>
  <FormGeneric
    :display-cancel-button="false"
    :full-width-button="true"
    :label-button-save="$t('components.signUpForm.signup')"
    :loading="loading"
    :error="error"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="form.name"
      class="mb-4"
      name="signUpForm.name"
      rules="required"
      as="div"
    >
      <label for="name" class="label-field-required">
        {{ $t('components.signUpForm.name') }}
      </label>
      <PrimeInputText id="name" v-bind="field" v-focus required />
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
  (e: 'submit', form: { email: string; name: string }): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    error?: Error | null
  }>(),
  {
    loading: () => false,
    error: () => null,
  },
)

const form = reactive({
  email: '',
  name: '',
})

const onSubmit = () => {
  emit('submit', form)
}
</script>
