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
    'lck-sidebar': Sidebar
  },
  props: {
    chapters: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style scoped>
.layout-with-sidebar .layout-sidebar {
  width: 300px;
}
</style>

<style>
.p-grid .main-container .responsive-table-wrapper {
  background: rgb(237,237,237) !important;
  background: linear-gradient(180deg, rgba(237,237,237,1) 2.3rem, rgba(255,255,255,1) 2.3rem, rgba(255,255,255,1) 100%) !important;
}
</style>
