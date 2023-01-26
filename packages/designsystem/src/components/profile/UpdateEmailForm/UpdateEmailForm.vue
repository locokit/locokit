<template>
  <FormGeneric
    :display-reset-button="false"
    :label-button-submit="'components.updateEmailForm.submit'"
    :display-success-form="true"
    :response="response"
    :loading="loading"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-3 mb-4">
      <p class="mr-1">
        {{ $t('components.updateUsernameForm.email') }}
      </p>
      <p class="font-bold">
        {{ user?.email }}
      </p>
    </div>
    <Field
      v-slot="{ field, errorMessage }"
      v-model="newEmail"
      class="mb-4"
      name="updateEmailForm.newEmail"
      rules="required|email"
      as="div"
      type="email"
    >
      <div class="grid grid-cols-3">
        <label for="name" class="label-field-required my-auto">
          {{ $t('components.updateEmailForm.newEmail') }}
        </label>

        <div class="col-span-2 w-full">
          <PrimeInputText
            id="email"
            class="!w-4/5 sm:!w-fit md:!w-3/5"
            :class="{ 'p-invalid': errorMessage }"
            v-bind="field"
            required
            type="email"
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
      v-model="password"
      class="mb-4"
      name="updateEmailForm.password"
      rules="required"
      as="div"
    >
      <div class="grid grid-cols-3">
        <label for="name" class="label-field-required my-auto">
          {{ $t('components.updateEmailForm.password') }}
        </label>

        <div class="w-full col-span-2">
          <PrimePassword
            v-bind="field"
            v-model="password"
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
  </FormGeneric>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import PrimePassword from 'primevue/password'
import FormGeneric from '../../FormGeneric/FormGeneric.vue'
import { Field } from 'vee-validate'
import { ref } from 'vue'

const emit = defineEmits<{
  (
    e: 'submit',
    form: {
      newEmail: string
      password: string
    },
  ): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    user: any
    loading?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response?: Error | Record<string, any> | null
  }>(),
  {
    user: null,
    loading: false,
    response: null,
  },
)

const newEmail = ref()
const password = ref()

const onSubmit = () => {
  emit('submit', {
    newEmail: newEmail.value,
    password: password.value,
  })
}
</script>
