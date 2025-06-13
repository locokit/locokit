<template>
  <Teleport defer :to="sidebar" v-if="sidebar">
    <aside class="py-2 px-3">
      <h2 class="text-2xl mb-3">{{ t('locokit.pages.workspace.policies') }}</h2>
      <ul>
        <sidebar-item v-for="item in items" :key="item.key" :item />
      </ul>
    </aside>
  </Teleport>

  <router-view :state />
</template>
<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import { useRoute } from 'vue-router'
import { useWorkspacePolicies } from '@/composables/useWorkspacePolicies'
import { computed, inject, type RendererElement } from 'vue'
import { useI18n } from 'vue-i18n'
import SidebarItem from '@/components/sidebar-item.vue'

const sidebar = inject<RendererElement>('sidebar')
const { t } = useI18n()

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.POLICIES.ROOT,
})

const route = useRoute()

const { state } = useWorkspacePolicies(route.params.wsslug as string)

const items = computed(() =>
  state.value.policies.map((p) => ({
    key: p.id,
    label: p.name,
    icon: 'bi bi-shield-lock text-xl',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.POLICIES.UUID,
      params: {
        wsslug: route.params.wsslug,
        uuid: p.id,
      },
    },
  })),
)
</script>
