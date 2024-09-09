<template>
  <div>
    <Form
      v-slot="{ meta: { valid, touched }, submitCount }"
      class="text-left"
      @submit="onSubmit"
    >
      <Field
        v-slot="{ field, errorMessage }"
        v-model="form.email"
        name="signInForm.email"
        class="mb-4 flex flex-col gap-2"
        as="div"
        rules="required|email"
      >
        <label for="email">
          {{ $t('locokit.components.signInForm.email') }}
        </label>
        <PrimeInputText
          id="email"
          v-bind="field"
          focus
          :invalid="!!errorMessage"
          type="email"
          required
          autocomplete="email"
        />
        <span
          v-if="errorMessage"
          class="text-red-500"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </span>
      </Field>
      <Field
        v-slot="{ field, errorMessage }"
        name="signInForm.password"
        class="mb-4 flex flex-col gap-2"
        as="div"
        rules="required"
      >
        <label for="password">
          {{ $t('locokit.components.signInForm.password') }}
        </label>
        <prime-password
          v-model="form.password"
          input-id="password"
          v-bind="field"
          :invalid="!!errorMessage"
          required
          toggle-mask
          :feedback="false"
          spellcheck="false"
          autocorrect="off"
          autocapitalize="none"
        />
        <span
          v-if="errorMessage"
          class="text-red-500"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </span>
        <a
          :href="lostPasswordRoute"
          class="w-fit my-4 block ml-auto text-xs primary"
        >
          {{ $t('locokit.components.signInForm.forgottenPassword') }}
        </a>
      </Field>
      <div class="flex flex-col">
        <PrimeButton
          type="submit"
          :disabled="loading || !valid"
          :status-form="status"
          :loading="loading"
          primary
          :label="$t('locokit.components.signInForm.signIn')"
        />
        <MessageForUser
          v-if="status === 'failed'"
          custom-msg-tk-error-form="locokit.error.notAuthenticated.description"
          status="failed"
        />
      </div>
    </Form>

    <div class="mt-4 pl-6 flex justify-center">
      <a v-if="displaySignUpLink" :href="signupRoute" class="w-fit text-md">
        {{ $t('locokit.components.signInForm.signUp') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
// N.B: We shouldn't use v-model and v-bind in the input according to [vee-validate good practices](https://vee-validate.logaretm.com/v4/api/field/#using-v-model) but without it, Password component of Prime does not work.
// And to date, no side effects have been encountered
import PrimeButton from 'primevue/button'
import PrimePassword from 'primevue/password'
import PrimeInputText from 'primevue/inputtext'
import MessageForUser from '@/components/data/MessageForUser/MessageForUser.vue'
import { Field, Form } from 'vee-validate'
import { computed, reactive } from 'vue'

const emit =
  defineEmits<
    (e: 'submit', form: { email: string; password: string }) => void
  >()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    displaySignUpLink?: boolean
    error?: Error | null
    signupRoute?: string
    lostPasswordRoute?: string
  }>(),
  {
    loading: false,
    displaySignUpLink: false,
    error: null,
    signupRoute: '',
    lostPasswordRoute: '',
  },
)

const form = reactive({
  email: '',
  password: '',
})

const status = computed(() => {
  if (props.error?.name) {
    return 'failed'
  } else if (props.error) {
    return 'success'
  }
  return null
})

const onSubmit = () => {
  emit('submit', form)
}
</script>
