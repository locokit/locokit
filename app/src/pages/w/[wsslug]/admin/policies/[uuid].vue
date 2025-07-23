<template>
  <main>Policy à présenter</main>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import { useRoute } from 'vue-router'
const route = useRoute()

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.POLICIES.UUID,
})
</script>
