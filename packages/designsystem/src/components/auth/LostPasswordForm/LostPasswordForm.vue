<template>
  <Form
    v-slot="{ meta: { valid, touched } }"
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
      <label for="email" class="label-field-required">
        {{ $t('components.lostPasswordForm.email') }}
      </label>
      <PrimeInputText
        id="email"
        v-bind="field"
        :class="{ 'p-invalid': errorMessage }"
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
      <ButtonWithStatus
        type="submit"
        label-tk="components.lostPasswordForm.submit"
        class="!w-full"
        :disabled="loading || !valid || !touched"
        :status-form="error ? 'failed' : null"
        icon="bi bi-save2"
        :is-submitting="loading"
      />
      <span class="mt-4">
        {{ $t('components.lostPasswordForm.signInHelp') }}
        <a class :href="signInRoute">
          {{ $t('components.lostPasswordForm.signIn') }}
        </a>
      </span>
      <MessageForUser v-if="error" status="failed" />
    </div>
  </Form>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import ButtonWithStatus from '../../ButtonWithStatus/ButtonWithStatus.vue'
import MessageForUser from '../../MessageForUser/MessageForUser.vue'
import { ref } from 'vue'
import { Field, Form } from 'vee-validate'

const emit = defineEmits<(e: 'submit', email: string) => void>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    error?: Error | null
    signInRoute: string
  }>(),
  {
    loading: false,
    error: null,
    signInRoute: '/',
  },
)

const email = ref('')

const onSubmit = () => {
  emit('submit', email.value)
}
</script>
