<template>
  <Form
    v-slot="{ meta: { valid, touched }, submitCount }"
    class="text-left w-full"
    @submit="onSubmit"
  >
    <Field
      v-slot="{ field, errorMessage }"
      v-model="username"
      class="mb-4"
      name="updateUsernameForm.username"
      rules="required"
      as="div"
    >
      <div class="grid grid-cols-3">
        <label for="name" class="label-field-required my-auto">
          {{ $t('components.updateUsernameForm.username') }}
        </label>

        <div class="col-span-2 w-full flex">
          <PrimeInputText
            id="name"
            class="!w-4/5 sm:!w-fit md:!w-3/5"
            :class="{ 'p-invalid': errorMessage }"
            v-bind="field"
            required
          />
          <ButtonWithStatus
            type="submit"
            :aria-label="$t('components.updateUsernameForm.submit')"
            :disabled="loading || !valid || !touched"
            :status-form="status"
            icon="bi bi-save2"
            :is-submitting="loading"
            :submit-count="submitCount"
          />
        </div>
      </div>
      <span
        v-if="errorMessage"
        class="p-text-error block"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </span>
    </Field>
    <div class="grid grid-cols-3 mb-4">
      <p class="mr-1">
        {{ $t('components.updateUsernameForm.email') }}
      </p>
      <p class="font-bold">
        {{ user?.email }}
      </p>
    </div>
    <div class="grid grid-cols-3 mb-4">
      <p class="mr-1">
        {{ $t('components.updateUsernameForm.role') }}
      </p>
      <SingleTag v-if="user" class="w-fit" :label="user?.profile" />
    </div>
    <div class="flex flex-row justify-end mt-4 pb-4"></div>
  </Form>
</template>

<script setup lang="ts">
import PrimeInputText from 'primevue/inputtext'
import ButtonWithStatus from '../../ButtonWithStatus/ButtonWithStatus.vue'
import { Form, Field } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import SingleTag from '../../SingleTag/SingleTag.vue'

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
      username: string
    },
  ): void
}>()

const username = ref(props?.user?.name)

const status = computed(() => {
  if (props.response && props.response.name) {
    return 'failed'
  } else if (props.response) {
    return 'success'
  }
  return null
})

const onSubmit = () => {
  emit('submit', {
    username: username.value,
  })
}

watch(
  () => props.user,
  (user) => {
    username.value = user?.name
  },
)
</script>
