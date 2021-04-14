<template>
  <span
    class="lck-badge"
    :style="{ color: '#' + badge.color, backgroundColor: '#' + badge.backgroundColor }"
  >
    <span class="lck-badge-content">{{ badge.label }}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LckBadge',
  props: {
    badge: {
      type: Object as { label: string; color: string; backgroundColor: string }
    }
  }
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
