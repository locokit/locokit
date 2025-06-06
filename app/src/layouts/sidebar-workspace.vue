<template>
  <LayoutSidebar
    v-if="workspace"
    locokit-logo-url="/assets/themes/locokit/logo.svg"
    workspace-logo-url="/assets/themes/hm/logo.png"
  >
    <template #sidebar-title>
      <h3 class="flex items-center text-2xl font-bold">
        <template v-if="workspace">
          <i
            v-if="workspace.settings?.icon"
            :class="workspace.settings?.icon"
            class="w-8 h-8 rounded-full mr-2"
          />
          <img v-else class="w-8 h-8 rounded-full mr-2" src="/assets/themes/locokit/favicon.svg" />
          {{ workspace.name }}
        </template>
        <template v-else>
          <i class="pi pi-spin pi-spinner"></i>
        </template>
      </h3>
    </template>
    <template #sidebar-nav="{ closeSidebar }">
      <ul class="pl-2">
        <!-- <li class="">
          <router-link

  activeClass="font-bold"
  exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.DASHBOARDS,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-graph-up-arrow text-xl"></i>
              Dashboards
            </span>
            <i class="bi bi-chevron-right font-bold text-xs"></i>
          </router-link>
        </li> -->
        <li class="">
          <router-link
            activeClass="font-bold"
            exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.ROOT,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-database-fill text-xl"></i>
              Datasources
            </span>
            <!-- <i class="bi bi-chevron-right font-bold text-xs" /> -->
          </router-link>
          <ul v-if="workspace.datasources">
            <li class="ml-8 my-1" v-for="datasource in workspace.datasources" :key="datasource.id">
              <router-link
                activeClass="font-bold"
                exactActiveClass="font-bold"
                :to="{
                  name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.SLUG,
                  params: { wsslug: workspace.slug, dsslug: datasource.slug },
                }"
                class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
              >
                <span class="flex items-center gap-2">
                  <i class="bi bi-database text-xl"></i>
                  {{ datasource.slug }}
                </span>
                <!-- <i class="bi bi-chevron-right font-bold text-xs"></i> -->
              </router-link>
              <ul v-if="datasource.tables">
                <li class="ml-8 my-1" v-for="table in datasource.tables" :key="table.id">
                  <router-link
                    activeClass="font-bold"
                    exactActiveClass="font-bold"
                    :to="{
                      name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.TABLES.SLUG,
                      params: {
                        wsslug: workspace.slug,
                        dsslug: datasource.slug,
                        tslug: table.slug,
                      },
                    }"
                    class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
                  >
                    <span class="flex items-center gap-2">
                      <i class="bi bi-table text-xl"></i>
                      {{ table.slug }}
                    </span>
                    <!-- <i class="bi bi-chevron-right font-bold text-xs"></i> -->
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <!-- <li class="">
          <router-link

  activeClass="font-bold"
  exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.APPS,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-window text-xl"></i>
              Applications
            </span>
            <i class="bi bi-chevron-right font-bold text-xs"></i>
          </router-link>
        </li>
        <li class="">
          <router-link

  activeClass="font-bold"
  exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.POLICIES,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-shield-fill-check text-xl"></i>
              Policies
            </span>
            <i class="bi bi-chevron-right font-bold text-xs"></i>
          </router-link>
        </li>
        <li class="">
          <router-link

  activeClass="font-bold"
  exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.GROUPS,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-people-fill text-xl"></i>
              Groupes
            </span>
            <i class="bi bi-chevron-right font-bold text-xs"></i>
          </router-link>
        </li>
        <li class="">
          <router-link

  activeClass="font-bold"
  exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.USERS,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-person-fill text-xl"></i>
              Utilisateurs
            </span>
            <i class="bi bi-chevron-right font-bold text-xs"></i>
          </router-link>
        </li>
        <li class="">
          <router-link

  activeClass="font-bold"
  exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.MEDIAS,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-file-earmark text-xl"></i>
              Medias
            </span>
            <i class="bi bi-chevron-right font-bold text-xs"></i>
          </router-link>
        </li>
        <li class="">
          <router-link

  activeClass="font-bold"
  exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.WORKFLOWS,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-lightning text-xl"></i>
              Workflows
            </span>
            <i class="bi bi-chevron-right font-bold text-xs"></i>
          </router-link>
        </li>
        <li class="">
          <router-link

  activeClass="font-bold"
  exactActiveClass="font-bold"
            :to="{
              name: ROUTE_NAMES.WORKSPACE.ADMIN.SETTINGS,
              params: { wsslug: workspace.slug },
            }"
            class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
          >
            <span class="flex items-center gap-2">
              <i class="bi bi-gear text-xl"></i>
              Settings
            </span>
          </router-link>
        </li> -->
      </ul>
    </template>
    <template #breadcrumb>
      <nav class="flex gap-2 overflow-x-auto">
        <template v-for="(b, index) in breadcrumbItems" :key="`breadcrumb-${index}`">
          <router-link :to="b.to" v-if="b.to">
            <i :class="b.icon" v-if="b.icon" />
            {{ b.label }}
          </router-link>
          <div v-else>
            <i :class="b.icon" v-if="b.icon" />
            {{ b.label }}
          </div>
          <i v-if="index < breadcrumbItems.length - 1" class="bi bi-chevron-right" />
        </template>
      </nav>
    </template>
    <slot></slot>
  </LayoutSidebar>
</template>

<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes'
import type { WorkspaceResult } from '@locokit/sdk'
import type { DatasourceResult } from '@locokit/sdk/dist/src/services/core/datasource/datasource.schema'
import { LayoutSidebar } from '@locokit/vue-components'
import { RouterLink } from 'vue-router'
import { useBreadcrumb } from '@/composables/useBreadcrumb'

defineProps<{
  workspace?: WorkspaceResult & {
    datasources?: (DatasourceResult & { tables?: [] })[]
  }
}>()

const { breadcrumbItems } = useBreadcrumb()
</script>
