<template>
  <div
    v-if="status === 'failed'"
    class="my-4 bg-error-lighten border-l-error-light border-l-4 p-1.5 rounded-lck flex"
    role="alert"
    aria-live="assertive"
  >
    <i class="bi bi-exclamation-triangle-fill self-center text-error-light" />
    <div class="ml-2 text-error-light">
      <p>
        {{ $t(customMsgTkErrorForm) }}
      </p>
      <p>
        {{ $t('error.redundantError') }}
      </p>
    </div>
  </div>
  <div
    v-if="status === 'success'"
    class="my-4 bg-success-lighten border-l-success-light border-l-4 p-1.5 rounded-lck flex"
  >
    <i class="bi bi-check2 self-center text-success-light" />
    <p class="ml-2 text-success-light">
      {{ $t(customMsgTkSuccessForm) }}
    </p>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    status?: 'failed' | 'success' | null
    customMsgTkSuccessForm?: string
    customMsgTkErrorForm?: string
  }>(),
  {
    status: null,
    customMsgTkSuccessForm: 'success.basic',
    customMsgTkErrorForm: 'error.basic',
  },
)
</script>
