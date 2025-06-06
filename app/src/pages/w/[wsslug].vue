<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import { definePage } from 'unplugin-vue-router/runtime'

definePage({
  name: ROUTE_NAMES.WORKSPACE.SLUG,
  redirect(to) {
    return {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.ROOT,
      params: to.params,
    }
  },
})
</script>

<template>
  <router-view />
</template>
