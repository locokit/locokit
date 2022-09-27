<template>
  <PrimeDialog
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
      'max-height': '70vh',
    }"
    :closeOnEscape="closeOnEscape"
    :closable="closable"
    class="p-fluid"
    @hide="$emit('close')"
    @update:visible="$emit('close')"
  >
    <slot></slot>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import PrimeDialog from "primevue/dialog";
import { useState } from "#app";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(
  defineProps<{
    header?: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    contentStyle?: Object;
    baseZIndex?: number;
    closable?: boolean;
    closeOnEscape?: boolean;
  }>(),
  {
    baseZIndex: () => 0,
    closable: () => true,
    closeOnEscape: () => true,
  }
);
const visible = useState('visible', () => false);
</script>

<style>
:deep(p-dialog) {
  width: 600px;
  max-width: min(600px, 100%);
}
</style>
