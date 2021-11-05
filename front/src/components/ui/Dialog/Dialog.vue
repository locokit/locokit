<template>
  <p-dialog
    :visible="visible"
    :style="{width: '600px'}"
    :header="header"
    :modal="true"
    :baseZIndex="baseZIndex"
    :contentStyle="{ ...contentStyle, 'max-height': '70vh'}"
    :closeOnEscape="closeOnEscape"
    :closable="closable"
    class="p-fluid"
    @hide="$emit('close')"
    @update:visible="$emit('close')"
  >
    <slot>
    </slot>

  </p-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from 'primevue/dialog'

export default {
  name: 'LckDialog',
  components: {
    'p-dialog': Vue.extend(Dialog),
  },
  props: {
    header: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    contentStyle: {
      type: Object,
    },
    baseZIndex: {
      type: Number,
      default: 0,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    closeOnEscape: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
