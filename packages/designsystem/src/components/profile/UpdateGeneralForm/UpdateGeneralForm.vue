<template>
  <FormGeneric
    :display-reset-button="false"
    label-button-submit="components.updateGeneralForm.submit"
    :display-success-form="true"
    :response="response"
    :loading="loading"
    class="w-3/4"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="name"
      class="mb-4"
      name="updateGeneralForm.name"
      rules="required"
      as="div"
    >
      <label for="name" class="label-field-required">
        {{ $t('components.updateGeneralForm.name') }}
      </label>
      <PrimeInputText
        id="name"
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
    <div class="mb-4">
      <p>
        {{ $t('components.updateGeneralForm.email') }}
      </p>
      <p class="my-1 font-bold">
        {{ user?.email }}
      </p>
    </div>
    <div class="mb-4">
      <p>
        {{ $t('components.updateGeneralForm.role') }}
      </p>
      <SingleTag class="my-1 w-fit" :label="user?.profile" />
    </div>
  </FormGeneric>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import { Field } from 'vee-validate'
import { ref, watch } from 'vue'
import SingleTag from '../../SingleTag/SingleTag.vue'
import FormGeneric from '../../FormGeneric/FormGeneric.vue'

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

const emit = defineEmits<{
  (
    e: 'submit',
    form: {
      name: string
      username: string
    },
  ): void
}>()

const name = ref(props?.user?.name)
const username = ref(props?.user?.username)

const onSubmit = () => {
  emit('submit', {
    name: name.value,
    username: username.value,
  })
}

watch(
  () => props.user,
  (user) => {
    name.value = user?.name
    username.value = user?.username
  },
)
</script>
