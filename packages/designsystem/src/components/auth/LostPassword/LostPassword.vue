<template>
  <Form
    @submit="onSubmit"
    v-slot="{ meta: { valid } }"
    class="text-left p-fluid"
  >
    <Field
      name="email"
      as="div"
      v-slot="{ field, errorMessage }"
      rules="required"
      class="mb-4 p-field"
      v-model="email"
    >
      <label for="email">{{ $t('components.lostPassword.email') }}</label>
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
        :label="$t('components.lostPassword.submit')"
        :disabled="loading || !valid"
        class="p-mb-2"
      />
      <span
        v-if="error"
        class="mt-4 p-text-error"
        role="alert"
        aria-live="assertive"
      >
        {{ $t('components.lostPassword.error') }}
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
    error?: Error
  }>(),
  {
    loading: () => false,
  },
)

const email = ref('')

const onSubmit = () => {
  emit('submit', email.value)
}
</script>
