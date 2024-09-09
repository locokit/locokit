<template>
  <div
    v-if="status === 'failed'"
    class="my-4 bg-error-100 border-l-error-500 border-l-4 p-1.5 flex"
    role="alert"
    aria-live="assertive"
  >
    <i class="bi bi-exclamation-triangle-fill self-center text-error-500" />
    <div class="ml-2 text-error-500">
      <p>
        {{ $t(props.customMsgTkErrorForm) }}
      </p>
      <p>
        {{ $t('locokit.error.redundantError') }}
      </p>
    </div>
  </div>
  <div
    v-if="status === 'success'"
    class="my-4 bg-success-100 border-l-success-500 border-l-4 p-1.5 flex"
  >
    <i class="bi bi-check2 self-center text-success-500" />
    <p class="ml-2 text-success-500">
      {{ $t(props.customMsgTkSuccessForm) }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    status?: 'failed' | 'success' | null
    customMsgTkSuccessForm?: string
    customMsgTkErrorForm?: string
  }>(),
  {
    status: null,
    customMsgTkSuccessForm: 'locokit.success.basic',
    customMsgTkErrorForm: 'locokit.error.basic',
  },
)
</script>
