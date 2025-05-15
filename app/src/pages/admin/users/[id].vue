<template>
  TODO
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import ROUTE_NAMES from '@/router/routes'

const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.ADMIN.USERS.RECORD
})
useHead({
  titleTemplate: `${t('locokit.pages.admin.title')} | %s`,
})
</script>
