<template>
  <div>
    <Form
      v-slot="{ meta: { valid } }"
      class="text-left p-fluid"
      @submit="onSubmit"
    >
      <Field
        v-slot="{ field, errorMessage }"
        v-model="form.email"
        name="loginForm.email"
        class="mb-4"
        as="div"
        rules="required"
      >
        <label for="email">{{ $t('components.loginForm.email') }}</label>
        <PrimeInputText
          id="email"
          v-bind="field"
          v-focus
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
        v-slot="{ field, errorMessage, meta }"
        name="loginForm.password"
        class="mb-4"
        as="div"
        rules="required"
      >
        <label for="password">{{ $t('components.loginForm.password') }}</label>
        <PrimePassword
          v-model="form.password"
          input-id="password"
          v-bind="field"
          required
          :toggle-mask="true"
          :feedback="false"
          spellcheck="false"
          autocorrect="off"
          autocapitalize="none"
        />
        <span
          v-if="errorMessage && meta.touched"
          class="p-text-error"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </span>
        <a :href="lostPasswordRoute" class="my-4 block ml-auto text-xs primary">
          {{ $t('components.loginForm.forgottenPassword') }}
        </a>
      </Field>
      <div class="flex flex-col">
        <PrimeButton
          type="submit"
          :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
          :label="
            logInAgain
              ? $t('components.loginForm.loginAgain')
              : $t('components.loginForm.login')
          "
          :disabled="loading || !valid"
        />
        <div
          v-if="error"
          class="flex flex-col mt-4 p-text-error"
          role="alert"
          aria-live="assertive"
        >
          <p v-if="error.name === 'NotAuthenticated'">
            {{ $t('error.notAuthenticated.login') }}
          </p>
          <p v-else>
            {{ $t('error.basic') }}
          </p>
          <p>{{ $t(`error.redundantError`) }}</p>
        </div>
      </div>
    </Form>

    <div v-if="!logInAgain" class="footer-links flex flex-wrap justify-center">
      <a v-if="displaySignUpLink" :href="signupRoute" class="text-md">
        {{ $t('components.loginForm.signup') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
// N.B: We shouldn't use v-model and v-bind in the input according to [vee-validate good practices](https://vee-validate.logaretm.com/v4/api/field/#using-v-model) but without it, Password component of Prime does not work.
// And to date, no side effects have been encountered
import PrimePassword from 'primevue/password'
import PrimeInputText from 'primevue/inputtext'
import PrimeButton from 'primevue/button'
import { Field, Form } from 'vee-validate'
import { reactive } from 'vue'

const emit = defineEmits<{
  (e: 'submit', form: { email: string; password: string }): void
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    logInAgain?: boolean
    displaySignUpLink?: boolean
    error?: Error | null
    signupRoute?: string
    lostPasswordRoute?: string
  }>(),
  {
    loading: () => false,
    logInAgain: () => false,
    displaySignUpLink: () => false,
    error: () => null,
    signupRoute: () => '',
    lostPasswordRoute: () => '',
  },
)

const form = reactive({
  email: '',
  password: '',
})

const onSubmit = () => {
  emit('submit', form)
}
</script>

<style scoped lang="scss">
.footer-links {
  margin: 1em 0.5em 0 2.5em;
}
</style>
