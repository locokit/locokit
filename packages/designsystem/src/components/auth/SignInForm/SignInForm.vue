<template>
  <div>
    <Form
      v-slot="{ meta: { valid, touched }, submitCount }"
      class="text-left p-fluid"
      @submit="onSubmit"
    >
      <Field
        v-slot="{ field, errorMessage }"
        v-model="form.email"
        name="signInForm.email"
        class="mb-4"
        as="div"
        rules="required|email"
      >
        <label for="email">
          {{ $t('components.signInForm.email') }}
        </label>
        <PrimeInputText
          id="email"
          v-bind="field"
          v-focus
          :class="{ 'p-invalid': errorMessage }"
          type="email"
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
      <Field
        v-slot="{ field, errorMessage }"
        name="signInForm.password"
        class="mb-4"
        as="div"
        rules="required"
      >
        <label for="password">
          {{ $t('components.signInForm.password') }}
        </label>
        <PrimePassword
          v-model="form.password"
          input-id="password"
          v-bind="field"
          :class="{ 'p-invalid': errorMessage }"
          required
          :toggle-mask="true"
          :feedback="false"
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
        <a
          :href="lostPasswordRoute"
          class="w-fit my-4 block ml-auto text-xs primary"
        >
          {{ $t('components.signInForm.forgottenPassword') }}
        </a>
      </Field>
      <div class="flex flex-col">
        <ButtonWithStatus
          type="submit"
          :label="$t('components.workspaceForm.submit')"
          class="!w-full"
          :disabled="loading || !valid || !touched"
          :status-form="status"
          icon="bi bi-save2"
          :is-submitting="loading"
          :submit-count="submitCount"
        />
        <div
          v-if="status === 'failed'"
          class="flex flex-col mt-4 p-text-error"
          role="alert"
          aria-live="assertive"
        >
          <p v-if="response.name === 'NotAuthenticated'">
            {{ $t('error.notAuthenticated.login') }}
          </p>
          <p v-else>
            {{ $t('error.basic') }}
          </p>
          <p>{{ $t(`error.redundantError`) }}</p>
        </div>
      </div>
    </Form>

    <div class="mt-4 pl-6 flex justify-center">
      <a v-if="displaySignUpLink" :href="signupRoute" class="w-fit text-md">
        {{ $t('components.signInForm.signUp') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
// N.B: We shouldn't use v-model and v-bind in the input according to [vee-validate good practices](https://vee-validate.logaretm.com/v4/api/field/#using-v-model) but without it, Password component of Prime does not work.
// And to date, no side effects have been encountered
import PrimePassword from 'primevue/password'
import PrimeInputText from 'primevue/inputtext'
import { Field, Form } from 'vee-validate'
import { computed, reactive } from 'vue'
import ButtonWithStatus from '../../ButtonWithStatus/ButtonWithStatus.vue'

const emit = defineEmits<{
  (e: 'submit', form: { email: string; password: string }): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    displaySignUpLink?: boolean
    response?: Error | null
    signupRoute?: string
    lostPasswordRoute?: string
  }>(),
  {
    loading: false,
    displaySignUpLink: false,
    response: null,
    signupRoute: '',
    lostPasswordRoute: '',
  },
)

const form = reactive({
  email: '',
  password: '',
})

const status = computed(() => {
  if (props.response && props.response.name) {
    return 'failed'
  } else if (props.response) {
    return 'success'
  }
  return null
})

const onSubmit = () => {
  emit('submit', form)
}
</script>
