<template>
  <div class="p-grid h-full layout-with-sidebar">
    <div
      class="lck-bg-primary o-auto h-max-full layout-sidebar"
    >
      <lck-sidebar
        v-if="chapters.length > 0"
        :chapters="chapters"
      />
    </div>
    <div class="h-full p-col o-auto h-max-full layout-main">
      <slot>
        This is the main content of the layout.
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Sidebar from '@/components/visualize/Sidebar/Sidebar.vue'

export default {
  name: 'LayoutWithSidebar',
  components: {
    'lck-sidebar': Sidebar,
  },
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
