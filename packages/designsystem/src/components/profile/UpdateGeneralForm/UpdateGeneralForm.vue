<template>
  <FormGeneric
    :display-reset-button="false"
    label-tk-button-submit="components.updateGeneralForm.submit"
    :response="response"
    :loading="loading"
    class="w-3/4"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="username"
      class="mb-4"
      name="updateGeneralForm.username"
      rules="required"
      as="div"
    >
      <label for="username" class="label-field-required">
        {{ $t('components.updateGeneralForm.username') }}
      </label>
      <PrimeInputText
        id="username"
        :class="{ 'p-invalid': errorMessage }"
        v-bind="field"
        required
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
      v-model="lastName"
      class="mb-4"
      name="updateGeneralForm.lastName"
      as="div"
    >
      <label for="lastName" class="label-field-required">
        {{ $t('components.updateGeneralForm.lastName') }}
      </label>
      <PrimeInputText
        id="lastName"
        :class="{ 'p-invalid': errorMessage }"
        v-bind="field"
        required
      />
      <span
        v-if="errorMessage"
        class="p-text-error block"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </span>
    </Field>
    <Field
      v-slot="{ field, errorMessage }"
      v-model="firstName"
      class="mb-4"
      name="updateGeneralForm.firstName"
      as="div"
    >
      <label for="firstName" class="label-field-required">
        {{ $t('components.updateGeneralForm.firstName') }}
      </label>
      <PrimeInputText
        id="firstName"
        :class="{
          'p-invalid': errorMessage,
        }"
        v-bind="field"
        required
      />
      <span
        v-if="errorMessage"
        class="p-text-error block"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </span>
    </Field>
    <div class="mb-4">
      <p>
        {{ $t('components.updateGeneralForm.email') }}
      </p>
      <p class="my-1 font-bold">
        {{ user.email }}
      </p>
    </div>
    <div class="mb-4">
      <p>
        {{ $t('components.updateGeneralForm.role') }}
      </p>
      <SingleTag
        class="my-1 w-fit"
        :label="
          $t(`components.updateGeneralForm.${user.profile.toLowerCase()}`)
        "
      />
    </div>
  </FormGeneric>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import { Field } from 'vee-validate'
import { ref } from 'vue'
import SingleTag from '../../SingleTag/SingleTag.vue'
import FormGeneric from '../../FormGeneric/FormGeneric.vue'

const emit = defineEmits<{
  (
    e: 'submit',
    form: {
      id: string
      lastName: string
      firstName: string | null
      username: string | null
    },
  ): void
}>()

const props = withDefaults(
  defineProps<{
    user: any
    loading?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response?: Error | Record<string, any> | null
  }>(),
  {
    loading: false,
    response: null,
  },
)
const lastName = ref(props.user.lastname)
const firstName = ref(props.user.firstname)
const username = ref(props.user.username)

const onSubmit = () => {
  emit('submit', {
    id: props.user.id,
    lastName: lastName.value,
    firstName: firstName.value,
    username: username.value,
  })
}
</script>
