<template>
  <p-button
    :icon="loading
      ? 'pi pi-spin pi-spinner'
      : error
        ? 'pi pi-exclamation-circle'
        : `${icon}`
    "
    :class="error
      ? 'p-button-outlined p-button-danger'
      : disabled
        ? 'p-button-outlined p-disabled'
        : classes
    "
    @click="$emit('click')"
    :disabled="disabled || loading"
    :title="loading
      ? $t('common.loading')
      : error || title"
  />
</template>

<script type="ts">
import Vue from 'vue'

import Button from 'primevue/button'

export default Vue.extend({
  name: 'LckStateButton',
  components: {
    'p-button': Button,
  },
  props: {
    classes: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Error,
      default: null,
    },
    icon: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
})
</script>
