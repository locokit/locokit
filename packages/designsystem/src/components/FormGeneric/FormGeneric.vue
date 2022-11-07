<template>
  <Form
    v-slot="{ isSubmitting, meta: { valid, touched } }"
    ref="refForm"
    class="p-fluid"
    :validation-schema="schema"
    @submit="onSubmit"
  >
    <slot />
    <div class="lck-form-footer text-right mb-4">
      <PrimeButton
        v-if="displayCancelButton"
        class="p-button-text p-button-secondary"
        :label="$t('components.formGeneric.cancel')"
        icon="pi pi-times"
        :class="{ 'full-width-button': fullWidthButton }"
        @click="onCancel"
      />
      <PrimeButton
        type="submit"
        :icon="isSubmitting || loading ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
        :label="labelButtonSave || $t('components.formGeneric.save')"
        :disabled="isSubmitting || loading || !valid || !touched"
        :class="{ 'full-width-button': fullWidthButton }"
      />
    </div>
    <span
      v-if="error"
      class="mt-4 p-text-error"
      role="alert"
      aria-live="assertive"
    >
      {{ $t('error.basic') }}

      <pre>
        {{ error.name }} : {{ error.message }}
      </pre>
    </span>
  </Form>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { Form } from 'vee-validate'
import { ref } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    loading?: boolean
    displayCancelButton?: boolean
    fullWidthButton?: boolean
    reset?: boolean
    labelButtonSave?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema?: any
    error?: Error | null
  }>(),
  {
    loading: () => false,
    displayCancelButton: () => true,
    fullWidthButton: () => false,
    reset: () => false,
    error: () => null,
    schema: () => ({}),
    labelButtonSave: () => '',
  },
)

const refForm = ref()

// Type any: is necessary because the submitted data is dependent on the parent component.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = (values: any) => {
  emit('submit', values)
}

const onCancel = () => {
  refForm.value.resetForm()
  emit('cancel')
}

// Todo: To check if this is still necessary
// watch: {
//   reset (newValue: boolean) {
//     if (newValue) {
//       (this.$refs['lck-form-record'] as HTMLFormElement).reset()
//       this.$emit('reset-form')
//     }
//   },
// },
</script>

<style scoped lang="scss">
.p-fluid {
  .lck-form-footer {
    .p-button {
      width: auto;
    }

    .full-width-button {
      width: 100%;
    }
  }
}
</style>
