<template>
  <span
    class="lck-badge"
    :style="{ color, backgroundColor }"
  >
    <span class="lck-badge-content">{{ label }}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LckBadge',
  props: {
    label: String, color: String, backgroundColor: String,
  },
})

</script>

<style>

.lck-badge {
  border-radius: var(--border-radius);
  padding: 0 0.5rem;
  margin-left: 0.5rem;
  display: inline-flex;
  font-size: 0.8rem;
  min-width: 0;
  max-width: 100%;
  /* for default purpose */
  background-color: #ccc;
  color: #000;
}

.lck-badge .lck-badge-content {
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
}

.lck-badge:first-of-type {
  margin-left: 0;
}

</style>
