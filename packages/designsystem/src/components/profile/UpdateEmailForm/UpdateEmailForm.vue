<template>
  <Form
    v-slot="{ meta: { valid }, isSubmitting }"
    class="text-left"
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
    <div class="grid grid-cols-3">
      <PrimeButton
        type="submit"
        class="col-start-2 col-span-2 !w-4/5 sm:!w-fit md:!w-3/5"
        :icon="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
        :label="$t('components.updateEmailForm.submit')"
        :disabled="isSubmitting || !valid"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import PrimeInputText from 'primevue/inputtext'
import PrimePassword from 'primevue/password'
import { Form, Field } from 'vee-validate'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    user: any
  }>(),
  {
    user: null,
  },
)

const emit = defineEmits<{
  (
    e: 'submit',
    form: {
      newEmail: string
      password: string
    },
  ): void
}>()

const newEmail = ref()
const password = ref()

const onSubmit = () => {
  emit('submit', {
    newEmail: newEmail.value,
    password: password.value,
  })
}
</script>
