<template>
  <Form
    v-slot="{ meta: { valid, touched }, submitCount }"
    ref="refForm"
    @submit="onSubmit"
  >
    <slot>
      Please provide fields for this form.
    </slot>
    <div class="text-right my-4 flex justify-end">
      <PrimeButton
        v-if="displayResetButton"
        class="p-button-outlined !mr-2"
        severity="secondary"
        :label="
          labelTkButtonReset
            ? $t(labelTkButtonReset)
            : $t('locokit.components.formGeneric.reset')
        "
        icon="bi bi-arrow-counterclockwise"
        :class="[fullWidthButton ? 'w-full' : '!w-fit']"
        @click="onReset"
      />
      <ButtonWithStatus
        type="submit"
        :full-width-button="fullWidthButton"
        :label-tk="labelTkButtonSubmit || 'locokit.components.formGeneric.save'"
        :disabled="loading || !valid || !touched"
        :status-form="status"
        icon="bi bi-check2"
        :is-submitting="loading"
        :submit-count="submitCount"
        :class-button="classSubmitButton"
      />
    </div>
    <MessageForUser
      v-if="(status === 'success' && displayMsgSuccess) || status === 'failed'"
      :status="status"
      :custom-msg-tk-success-form="customMsgTkSuccessForm"
      :custom-msg-tk-error-form="customMsgTkErrorForm"
    />
  </Form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PrimeButton from 'primevue/button'
import { Form } from 'vee-validate'
import ButtonWithStatus from '@/components/ui/ButtonWithStatus/ButtonWithStatus.vue'
import MessageForUser from '@/components/data/MessageForUser/MessageForUser.vue'

const emit = defineEmits(['submit', 'reset'])
const props = withDefaults(
  defineProps<{
    displayResetButton?: boolean
    loading?: boolean
    fullWidthButton?: boolean
    reset?: boolean
    labelTkButtonSubmit?: string | null
    labelTkButtonReset?: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response?: Error | Record<string, any> | null
    displayMsgSuccess?: boolean
    customMsgTkSuccessForm?: string | null
    customMsgTkErrorForm?: string | null
    classSubmitButton?: string | null
    resetFormWithEmptyValue?: boolean
  }>(),
  {
    displayResetButton: true,
    loading: false,
    fullWidthButton: false,
    reset: false,
    response: null,
    labelTkButtonSubmit: null,
    labelTkButtonReset: null,
    displayMsgSuccess: true,
    customMsgTkSuccessForm: 'locokit.success.basic',
    customMsgTkErrorForm: 'locokit.error.basic',
    classSubmitButton: null,
    resetFormWithEmptyValue: true,
  },
)

const refForm = ref()

const status = computed(() => {
  if (props.response?.name && props.response.message) {
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
