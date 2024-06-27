<template>
  <button
    class="select-none m-0 rounded-[2rem] text-white border p-2 focus:outline-none focus:ring-2 focus:ring-inset inline-flex enabled:hover:text-white"
    :class="[
      { 'cursor-not-allowed opacity-70': isDisabled },
      {
        'bg-primary border-primary focus:ring-primary-dark enabled:hover:bg-primary-dark enabled:hover:border-primary-dark':
          props.primary,
      },
      {
        'bg-secondary border-secondary focus:ring-secondary-dark enabled:hover:bg-secondary-dark enabled:hover:border-secondary-dark':
          props.secondary,
      },
      fullWidthButton ? 'w-full' : 'w-fit',
      classButton,
    ]"
    :type="type"
    :aria-label="$t(labelTk)"
    :disabled="isDisabled"
  >
    <svg
      v-if="isSubmitting"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="ml-1 bi bi-arrow-clockwise animate-spin h-5 w-5"
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
    <i v-else-if="status === 'success'" class="ml-1 bi bi-check-circle" />
    <i v-else-if="status === 'failed'" class="ml-1 bi bi-x-circle" />
    <i v-else-if="icon" class="mx-1 text-white" :class="icon" />
    <span
      v-if="labelTk"
      class="flex-auto"
      :class="{ 'mr-3': icon, 'ml-1': status || isSubmitting }"
    >
      {{ $t(labelToDisplay) }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    labelTk?: string
    icon?: string | null
    disabled?: boolean
    type: 'submit' | 'button' | 'reset'
    statusForm?: 'success' | 'failed' | null
    isSubmitting?: boolean
    fullWidthButton?: boolean
    submitCount?: number
    classButton?: string | null
    primary?: boolean
    secondary?: boolean
  }>(),
  {
    labelTk: '',
    icon: null,
    disabled: false,
    type: 'button',
    statusForm: null,
    isSubmitting: false,
    fullWidthButton: false,
    submitCount: 0,
    classButton: null,
    primary: true,
    secondary: false,
  },
)

const status = ref(props.statusForm)

const isDisabled = computed(() => {
  if (props.disabled) {
    return true
  } else if (status.value !== null) {
    return true
  } else if (props.isSubmitting) {
    return true
  }
  return false
})

const labelToDisplay = computed(() => {
  if (status.value === 'failed') {
    return 'locokit.components.buttonWithStatus.statusFailed'
  } else if (status.value === 'success') {
    return 'locokit.components.buttonWithStatus.statusSuccess'
  } else if (props.isSubmitting) {
    return 'locokit.components.buttonWithStatus.loading'
  }
  return props.labelTk
})

watch(
  () => props.statusForm,
  (statusForm: 'success' | 'failed' | null) => {
    status.value = statusForm
    setTimeout(() => {
      status.value = null
    }, 5000)
  },
  {
    immediate: true,
  },
)
</script>
