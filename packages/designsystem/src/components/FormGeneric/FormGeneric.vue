<template>
  <Form
    class="p-fluid"
    @submit="onSubmit"
    v-slot="{ isSubmitting, handleReset, meta: { valid, touched } }"
    @reset="handleReset"
    ref="lck-form-record"
    :validation-schema="schema"
  >
    <slot />
    <div class="lck-form-footer text-right mb-4">
      <PrimeButton
        v-if="displayCancelButton"
        class="p-button-text p-button-secondary"
        :label="$t('components.formGeneric.cancel')"
        icon="pi pi-times"
        :class="{ 'full-width-button': fullWidthButton }"
        @click="$emit('cancel')"
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
      {{ $t('components.signUp.error') }}
    </span>
  </Form>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import { defineProps } from 'vue'
import { Form } from 'vee-validate'

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
    error?: Error
  }>(),
  {
    loading: () => false,
    displayCancelButton: () => true,
    fullWidthButton: () => false,
    reset: () => false,
  },
)

// Necessary because the submitted data is dependent on the parent component.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = (values: any) => {
  emit('submit', values)
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
