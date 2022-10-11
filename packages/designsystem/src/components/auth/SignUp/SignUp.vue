<template>
  <FormGeneric
    :displayCancelButton="false"
    :fullWidthButton="true"
    :labelButtonSave="$t('components.signUp.signup')"
    :loading="loading"
    @submit="onSubmit"
    :error="error"
  >
    <Field
      class="mb-4"
      name="name"
      rules="required"
      as="div"
      v-slot="{ field, errorMessage }"
      v-model="form.name"
    >
      <label for="name" class="label-field-required">
        {{ $t('components.signUp.name') }}
      </label>
      <PrimeInputText id="name" v-bind="field" v-focus required />
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
      class="mb-4"
      name="email"
      rules="required|email"
      as="div"
      v-slot="{ field, errorMessage }"
      v-model="form.email"
    >
      <label for="email" class="label-field-required">
        {{ $t('components.signUp.email') }}
      </label>
      <PrimeInputText id="email" v-bind="field" required />
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
import FormGeneric from '../../FormGeneric/FormGeneric.vue'
import { Field } from 'vee-validate'
import { reactive } from 'vue'

const emit = defineEmits<{
  (e: 'submit', form: { email: string; name: string }): void
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

const form = reactive({
  email: '',
  name: '',
})

const onSubmit = () => {
  emit('submit', form)
}
</script>

<style scoped>
.invalid {
  color: var(--color-error);
}
</style>
