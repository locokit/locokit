<template>
  <FormGeneric
    :display-reset-button="false"
    label-tk-button-submit="locokit.components.updateGeneralForm.submit"
    :response="response"
    :loading="loading"
    class="w-3/4"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="username"
      class="mb-4 flex flex-col gap-2"
      name="updateGeneralForm.username"
      rules="required"
      as="div"
    >
      <label for="username" class="label-field-required">
        {{ $t('locokit.components.updateGeneralForm.username') }}
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
      class="mb-4 flex flex-col gap-2"
      name="updateGeneralForm.lastName"
      as="div"
    >
      <label for="lastName" class="label-field-required">
        {{ $t('locokit.components.updateGeneralForm.lastName') }}
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
      class="mb-4 flex flex-col gap-2"
      name="updateGeneralForm.firstName"
      as="div"
    >
      <label for="firstName" class="label-field-required">
        {{ $t('locokit.components.updateGeneralForm.firstName') }}
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
        {{ $t('locokit.components.updateGeneralForm.email') }}
      </p>
      <p class="my-1 font-bold">
        {{ user.email }}
      </p>
    </div>
    <div class="mb-4">
      <p>
        {{ $t('locokit.components.updateGeneralForm.role') }}
      </p>
      <SingleTag
        class="my-1 w-fit"
        :label="
          $t(
            `locokit.components.updateGeneralForm.${user.profile.toLowerCase()}`,
          )
        "
      />
    </div>
  </FormGeneric>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import { Field } from 'vee-validate'
import { ref } from 'vue'
import SingleTag from '@/components/ui/SingleTag/SingleTag.vue'
import FormGeneric from '@/components/forms/FormGeneric.vue'

const emit = defineEmits<
  (
    e: 'submit',
    form: {
      id: string
      lastName: string
      firstName: string | null
      username: string | null
    },
  ) => void
>()

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
const lastName = ref(props.user.lastName)
const firstName = ref(props.user.firstName)
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
