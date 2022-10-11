<template>
  <div>
    <Form
      @submit="onSubmit"
      v-slot="{ meta: { valid } }"
      class="text-left p-fluid"
    >
      <Field
        name="email"
        class="mb-4"
        as="div"
        v-model="form.email"
        v-slot="{ field, errorMessage }"
        rules="required"
      >
        <label for="email">{{ $t('components.loginForm.email') }}</label>
        <PrimeInputText
          id="email"
          v-bind="field"
          type="email"
          required
          autocomplete="email"
          v-focus
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
        name="password"
        class="mb-4"
        as="div"
        v-slot="{ field, errorMessage, meta }"
        rules="required"
      >
        <label for="password">{{ $t('components.loginForm.password') }}</label>
        <PrimePassword
          inputId="password"
          v-model="form.password"
          v-bind="field"
          required
          :toggleMask="true"
          :feedback="false"
        />
        <span
          v-if="errorMessage && meta.touched"
          class="p-text-error"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </span>
        <a :href="lostPasswordRoute" class="my-4 block ml-auto">
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
        <span
          v-if="error"
          class="mt-4 p-text-error"
          role="alert"
          aria-live="assertive"
        >
          {{ $t('components.loginForm.error') }}
        </span>
      </div>
    </Form>

    <div v-if="!logInAgain" class="footer-links flex flex-wrap justify-center">
      <a v-if="displaySignUpLink" :href="signupRoute">
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
    error?: Error
    signupRoute?: string
    lostPasswordRoute?: string
  }>(),
  {
    loading: () => false,
    logInAgain: () => false,
    displaySignUpLink: () => false,
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
a {
  font-size: var(--font-size-md);
}

.footer-links {
  margin: 1em 0.5em 0 2.5em;
}
</style>
