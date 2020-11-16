<template>
  <p-dialog
    :visible="visible"
    :style="{width: '450px'}"
    :header="header"
    :modal="true"
    :contentStyle="{ 'max-height': '60vh'}"
    :closeOnEscape="true"
    class="p-fluid"
    @hide="$emit('close')"
    @update:visible="$emit('close')"
  >
    <slot>
    </slot>

    <template #footer>
      <slot name='footer'>
        <p-button
          :label="$t('form.cancel')"
          icon="pi pi-times"
          class="p-button-text p-button-secondary"
          @click="$emit('close')"
        />
        <p-button
          disabled
          v-if="submitting"
          :label="$t('form.waiting')"
          icon="pi pi-spin pi-spinner"
          class="p-button-text"
        />
        <p-button
          v-else
          :label="$t('form.submit')"
          icon="pi pi-check"
          class="p-button-primary"
          @click="$emit('input')"
        />
      </slot>
    </template>
  </p-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

export default {
  name: 'LckDialog',
  components: {
    'p-dialog': Vue.extend(Dialog),
    'p-button': Vue.extend(Button)
  },
  props: {
    header: {
      type: String,
      default () {
        return this.$t('components.dialog.defaultHeader')
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    submitting: {
      type: Boolean,
      default: false
    }
  }
}
</script>
