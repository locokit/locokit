<template><router-view /></template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.TABLES.ROOT,
})
</script>
