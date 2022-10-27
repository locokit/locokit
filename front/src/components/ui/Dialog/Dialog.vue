<template>
  <p-dialog
    :visible="visible"
    containerStyle=""
    :header="header"
    :modal="true"
    :baseZIndex="baseZIndex"
    :contentStyle="{
      ...contentStyle,
      'overflow-y': 'auto',
      width: '800px',
      'max-width': 'min(800px, 100%)',
      'max-height': '70vh'
    }"
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

export default Vue.extend({
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
})
</script>

<style>
::v-deep .p-dialog {
  width: 600px;
  max-width: min(600px, 100%);
}
@media screen and (max-width: 768px) {
  div[role="dialog"][aria-modal="true"] {
    width: min(500px , 90%)
  }
}</style>
