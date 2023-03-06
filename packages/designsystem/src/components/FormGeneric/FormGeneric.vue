<template>
  <Form
    v-slot="{ meta: { valid, touched }, submitCount }"
    ref="refForm"
    class="p-fluid"
    @submit="onSubmit"
  >
    <slot />
    <div class="text-right mb-4 flex justify-end">
      <PrimeButton
        v-if="displayResetButton"
        class="p-button-outlined p-button-rounded !mr-2"
        :label="$t('components.formGeneric.reset')"
        icon="bi bi-arrow-counterclockwise"
        :class="[fullWidthButton ? 'w-full' : '!w-fit']"
        @click="onReset"
      />
      <ButtonWithStatus
        type="submit"
        :full-width-button="fullWidthButton"
        :label="labelButtonSubmit || 'components.formGeneric.save'"
        :disabled="loading || !valid || !touched"
        :status-form="status"
        icon="bi bi-check2"
        :is-submitting="loading"
        :submit-count="submitCount"
        :color="colorSubmitButton"
      />
    </div>
    <div
      v-if="status === 'failed' && displayErrorForm"
      class="mt-4 p-text-error"
      role="alert"
      aria-live="assertive"
    >
      <p>
        {{ $t('error.basic') }}
      </p>
      <p>{{ $t('error.redundantError') }}</p>
    </div>
    <div v-if="status === 'success' && displaySuccessForm" class="mt-4">
      <p>
        {{ $t('success.general') }}
      </p>
    </div>
  </Form>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import ButtonWithStatus from '../ButtonWithStatus/ButtonWithStatus.vue'
import { Form } from 'vee-validate'
import { computed, ref } from 'vue'

const emit = defineEmits(['submit', 'reset'])

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    displayResetButton?: boolean
    loading?: boolean
    fullWidthButton?: boolean
    reset?: boolean
    labelButtonSubmit?: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response?: Error | Record<string, any> | null
    displayErrorForm?: boolean
    displaySuccessForm?: boolean
    colorSubmitButton?: 'primary' | 'secondary'
    resetFormWithEmptyValue?: boolean
  }>(),
  {
    displayResetButton: true,
    loading: false,
    fullWidthButton: false,
    reset: false,
    response: null,
    labelButtonSubmit: null,
    displayErrorForm: true,
    displaySuccessForm: false,
    colorSubmitButton: 'primary',
    resetFormWithEmptyValue: true,
  },
)

const refForm = ref()

const status = computed(() => {
  if (props.response && props.response.name) {
    return 'failed'
  } else if (props.response) {
    return 'success'
  }
  return null
})

// Type any: is necessary because the submitted data is dependent on the parent component.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = (values: any) => {
  emit('submit', values)
}

const onReset = () => {
  if (props.resetFormWithEmptyValue) {
    refForm.value.resetForm()
  }
  emit('reset')
}
</script>
