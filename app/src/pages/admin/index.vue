<template>
  <LayoutHeader>Administration</LayoutHeader>
</template>

<script setup lang="ts">
import LayoutHeader from '@/layouts/header.vue'
import ROUTE_NAMES from '@/router/routes';

definePage({
  name: ROUTE_NAMES.ADMIN.HOME,
})
</script>
