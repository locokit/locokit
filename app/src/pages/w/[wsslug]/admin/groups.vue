<template>
  <Teleport defer :to="sidebar" v-if="sidebar">
    <aside class="py-2 px-3">
      <h2 class="text-2xl mb-3">
        {{ t('locokit.pages.workspace.groups') }}
      </h2>
      <prime-button
        as="router-link"
        :label="t('locokit.pages.adminGroups.addGroup')"
        :to="{ name: ROUTE_NAMES.WORKSPACE.ADMIN.GROUPS.CREATE, params: route.params }"
        fluid
      />
      <prime-icon-field class="my-4">
        <prime-input-icon class="bi bi-search" />
        <prime-input-text
          v-model="state.search"
          :placeholder="t('locokit.pages.adminGroups.search')"
        />
      </prime-icon-field>

      <ul>
        <sidebar-item v-for="item in items" :item :key="item.key" />
      </ul>
    </aside>
  </Teleport>

  <router-view v-slot="{ Component }">
    <div class="h-full overflow-auto">
      <component
        @group-created="fetchGroups"
        @group-patched="fetchGroups"
        :is="Component"
        v-if="Component"
      />
      <template v-else>
        <main class="p-3">
          <h1 class="text-primary text-4xl mt-0 mb-4">
            {{ t('locokit.pages.workspace.groups') }}
          </h1>

          <div class="flex flex-wrap gap-2">
            Statistiques : nombre de groupes, nombre d'utilisateurs
          </div>
        </main>
      </template>
    </div>
  </router-view>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import { computed, inject, type RendererElement } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGroups } from '@/composables/useGroups'
import { useRoute } from 'vue-router'
import PrimeButton from 'primevue/button'
import PrimeIconField from 'primevue/iconfield'
import PrimeInputIcon from 'primevue/inputicon'
import PrimeInputText from 'primevue/inputtext'
import SidebarItem from '@/components/sidebar-item.vue'

const route = useRoute()

const sidebar = inject<RendererElement>('sidebar')
const { t } = useI18n()

const { state, fetchGroups } = useGroups(route.params.wsslug)

definePage({
  name: ROUTE_NAMES.WORKSPACE.ADMIN.GROUPS.ROOT,
})

const items = computed(() =>
  state.value.groups?.map((g) => ({
    key: g.id,
    label: g.name,
    icon: 'bi bi-people text-xl',
    to: {
      name: ROUTE_NAMES.WORKSPACE.ADMIN.GROUPS.UUID,
      params: {
        wsslug: route.params.wsslug,
        guuid: g.id,
      },
    },
  })),
)
</script>
