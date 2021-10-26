<template>
  <div class="lck-layout-content">
    <slot name="sidebar" />
    <div class="h-full o-auto h-max-full">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LayoutWithSidebar',
  props: {
    chapters: {
      type: Array,
      default: () => ([]),
    },
  },
}
</script>

<style scoped>
.layout-with-sidebar .layout-sidebar {
  width: 300px;
}
</style>
