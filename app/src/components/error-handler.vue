<template>
  <div v-if="loading" class="flex justify-center items-center h-full">
    <PrimeProgressSpinner stroke-width="2" style="width: 80px; height: 80px" />
  </div>
  <div
    v-else-if="currentError === 'not-found'"
    class="flex flex-col gap-4 items-center py-5 text-xl"
  >
    <slot name="not-found-icon">
      <i class="bi bi-file-earmark-x text-5xl" aria-hidden="true" />
    </slot>
    <slot name="not-found">
      <p>{{ t('locokit.pages.error.404.title') }}</p>
    </slot>
  </div>
  <div v-else-if="currentError" class="flex flex-col gap-4 items-center py-5 text-xl">
    <slot name="error-icon" :error="currentError">
      <i class="bi bi-bug-fill text-5xl" aria-hidden="true" />
    </slot>
    <slot name="error" :error="currentError">
      <p>{{ t('locokit.error.basic') }}</p>
      <p v-if="$isDevEnv">{{ currentError }}</p>
    </slot>
  </div>
  <template v-else>
    <slot></slot>
  </template>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, watchEffect, type ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import PrimeProgressSpinner from 'primevue/progressspinner'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    loading?: boolean
    error?: unknown | null
    bubblingErrorCapture?: boolean
    bubblingErrorFilter?:
      | ((error: unknown, instance: ComponentPublicInstance | null, info: string) => boolean)
      | null
  }>(),
  {
    loading: false,
    bubblingErrorCapture: false,
    bubblingErrorFilter: null,
  },
)

const currentError = ref<unknown | null>(props.error)

watchEffect(() => {
  currentError.value = props.error
})

onErrorCaptured(
  (capturedError: unknown, instance: ComponentPublicInstance | null, info: string) => {
    if (props.bubblingErrorCapture) {
      let capture = true
      if (props.bubblingErrorFilter) {
        capture = props.bubblingErrorFilter(capturedError, instance, info)
      }
      if (capture) {
        currentError.value = capturedError
        return false
      }
    }
    return true
  },
)
</script>
