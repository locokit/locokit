<template>
  <prime-button
    :type="type"
    :aria-label="$t(labelTk)"
    :disabled="isDisabled"
    :iconPos="iconPos"
    :icon="icon"
    :primary="props.primary"
    :secondary="props.secondary"
    :label="$t(labelToDisplay)"
  >
    <!-- <i v-if="status === 'success'" class="ml-1 bi bi-check-circle" />
    <i v-else-if="status === 'failed'" class="ml-1 bi bi-x-circle" />
    <i v-else-if="icon" class="mx-1 text-white" :class="icon" />
    <span
      v-if="labelTk"
      class="flex-auto"
      :class="{ 'mr-3': icon, 'ml-1': status || isSubmitting }"
    >
      {{ $t(labelToDisplay) }}
    </span> -->
  </prime-button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PrimeButton from 'primevue/button'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    /* label translation key */
    labelTk?: string
    icon?: string | null
    iconPos?: string | null
    disabled?: boolean
    type: 'submit' | 'button' | 'reset'
    statusForm?: 'success' | 'failed' | null
    isSubmitting?: boolean
    submitCount?: number
    primary?: boolean
    secondary?: boolean
  }>(),
  {
    labelTk: '',
    icon: null,
    iconPos: 'right',
    disabled: false,
    type: 'button',
    statusForm: null,
    isSubmitting: false,
    submitCount: 0,
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
    }, 2500)
  },
  {
    immediate: true,
  },
)
</script>
