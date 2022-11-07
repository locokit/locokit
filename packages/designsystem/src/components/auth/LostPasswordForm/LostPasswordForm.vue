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
      rules="required|email"
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
    <div class="flex flex-col">
      <PrimeButton
        type="submit"
        :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
        :label="$t('components.lostPasswordForm.submit')"
        :disabled="loading || !valid"
        class="mb-4"
      />
      <span>
        {{ $t('components.lostPasswordForm.signInHelp') }}
        <a class :href="signInRoute">
          {{ $t('components.lostPasswordForm.signIn') }}
        </a>
      </span>
      <div
        v-if="error"
        class="flex flex-col mt-4 p-text-error"
        role="alert"
        aria-live="assertive"
      >
        <p v-if="error.name === 'BadRequest'">
          {{ $t('error.badRequest.lostPassword') }}
        </p>
        <p v-else>
          {{ $t('error.basic') }}
        </p>
        <p>{{ $t(`error.redundantError`) }}</p>
      </div>
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
    signInRoute: string
  }>(),
  {
    loading: () => false,
    error: () => null,
    signInRoute: () => '/signin',
  },
)

const email = ref('')

const onSubmit = () => {
  emit('submit', email.value)
}
</script>
