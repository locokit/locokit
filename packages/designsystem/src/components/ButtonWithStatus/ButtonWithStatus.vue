<template>
  <button
    class="select-none m-0 rounded text-white bg-primary border border-primary border p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 inline-flex"
    :class="[
      { 'cursor-not-allowed opacity-70': isDisabled },
      fullWidthButton ? 'w-full' : 'w-fit',
    ]"
    :type="type"
    :aria-label="label"
    :disabled="isDisabled"
  >
    <svg
      v-if="isSubmitting"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-arrow-clockwise animate-spin h-5 w-5 text-gray-500"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
      />
      <path
        d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
      />
    </svg>
    <i
      v-else-if="status === 'success'"
      class="bi bi-check-circle text-gray-500"
    />
    <i v-else-if="status === 'failed'" class="bi bi-x-circle text-gray-500" />
    <i v-else-if="icon" class="text-white" :class="'bi ' + icon" />
    <span v-if="label" class="flex-auto" :class="{ 'ml-2': icon }">
      {{ $t(labelToDisplay) }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    label?: string | null
    icon?: string | null
    disabled?: boolean
    type: 'submit' | 'button' | 'reset'
    statusForm?: string | null // success, failed, null
    isSubmitting?: boolean
    fullWidthButton?: boolean
    submitCount?: number
  }>(),
  {
    label: '',
    disabled: false,
    icon: null,
    type: 'button',
    statusForm: null,
    isSubmitting: false,
    fullWidthButton: false,
    submitCount: 0,
  },
)

const status = ref(props.statusForm)

const isDisabled = computed(() => {
  if (props.disabled) {
    return true
  } else if (status.value !== null) {
    return true
  }
  return false
})

const labelToDisplay = computed(() => {
  if (status.value === 'failed') {
    return 'components.buttonWithStatus.statusFailed'
  } else if (status.value === 'success') {
    return 'components.buttonWithStatus.statusSuccess'
  } else if (props.isSubmitting) {
    return 'components.buttonWithStatus.loading'
  }
  return props.label
})

watch(
  () => props.statusForm,
  (statusForm: string | null) => {
    status.value = statusForm
    if (props.submitCount > 0) {
      setTimeout(() => {
        status.value = null
      }, 5000)
    }
  },
)
</script>

<style scoped>
button:enabled:hover {
  background: var(--primary-color-dark);
  color: var(--color-white);
  border-color: var(--primary-color-dark);
  transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
}
</style>
