<template>
  <p-dialog
    :visible="visible"
    :style="{width: '600px'}"
    :header="header"
    :modal="true"
    :contentStyle="{ 'max-height': '70vh'}"
    :closeOnEscape="true"
    class="p-fluid"
    @hide="$emit('close')"
    @update:visible="$emit('close')"
  >
    <slot>
    </slot>

    <template
      #footer
      v-if="withFooter"
    >
      <slot name='footer'>
        <p-button
          :label="$t('dialog.close')"
          icon="pi pi-times"
          class="p-button-text p-button-secondary"
          @click="$emit('close')"
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
      type: String
    },
    visible: {
      type: Boolean,
      default: false
    },
    submitting: {
      type: Boolean,
      default: false
    },
    withFooter: {
      type: Boolean,
      default: true
    }
  }
}
</script>
