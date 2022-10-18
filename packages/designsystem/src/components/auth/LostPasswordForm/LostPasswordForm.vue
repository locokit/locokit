<template>
  <Form
    v-slot="{ meta: { valid } }"
    class="text-left p-fluid"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="email"
      name="lostPasswordForm.email"
      as="div"
      rules="required"
      class="mb-4 p-field"
    >
      <label for="email">{{ $t('components.lostPasswordForm.email') }}</label>
      <PrimeInputText
        id="email"
        v-bind="field"
        type="text"
        required
        autocomplete="email"
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
    <div class="p-d-flex p-flex-column">
      <PrimeButton
        type="submit"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
        :label="$t('components.lostPasswordForm.submit')"
        :disabled="loading || !valid"
        class="p-mb-2"
      />
      <span
        v-if="error"
        class="mt-4 p-text-error"
        role="alert"
        aria-live="assertive"
      >
        {{ $t('components.lostPasswordForm.error') }}
      </span>
    </div>
  </Form>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import PrimeButton from 'primevue/button'
import { ref } from 'vue'
import { Field, Form } from 'vee-validate'

const emit = defineEmits<{
  (e: 'submit', email: string): void
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

const email = ref('')

const onSubmit = () => {
  emit('submit', email.value)
}
</script>
